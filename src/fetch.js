const axios = require('axios')
const queryString = require('query-string')
const _ = require('lodash')

module.exports = async ({
  apiURL,
  bucketSlug,
  object,
  apiAccess,
  limit,
  preview,
  debug
}) => {
  // check if we have a basic object type string, or override config parmas for this object type.
  const objectType = (typeof object === "string") ? object : object.type
  // set the api batch limit to the global setting or the object type override
  const batchSize = (object.params && object.params.limit) ? object.params.limit : limit

  const timeLabel = `Fetch Cosmic JS data for (${objectType})`;
  const axiosHeader = {
    headers: {
      'Accept-Encoding': 'gzip, deflate'
    }
  }
  let objects = []
  let skip = 0
  console.time(timeLabel)
  console.log(`Starting to fetch data from Cosmic JS (${objectType})`)

  // Define URL params
  let urlParams = queryString.stringify({
    type: objectType,
    ...(preview && {
      status: 'all'
    }),
    ...(apiAccess && apiAccess.read_key && {
      read_key: apiAccess.read_key
    }),
  })

  // Handle additional API request parameters from gatsby-config.js
  if (object.params) {
    urlParams += "&" + queryString.stringify(object.params)
  }
  else {
    urlParams += `&limit=${batchSize}`
  }

  // Define API endpoint.
  let apiEndpoint = `${apiURL}/${bucketSlug}/objects?${urlParams}`

  if (debug) {
    console.info("api endpoint: ", apiEndpoint)
  }

  let documents = {}
  try {
    // Make API request.
    documents = await axios(apiEndpoint, axiosHeader)
    const firstResponseSize = documents.headers['content-length']
    if (debug) {
      console.info(`Cosmicjs Response size: (${objectType}) ${formatBytes(firstResponseSize)}`)
    }
    if (firstResponseSize > 4100000) {
      console.info("size", firstResponseSize)
      console.warn(`Cosmicjs response is close to API limit: (${objectType}) ${formatBytes(firstResponseSize)}` +
        "\n" +
        `Consider using the "limit" param to reduce objects per request` +
        "\n"
      )
    }
  }
  catch (e) {
    console.error(`(${objectType}) error - ${e.response.status}: `, e.response.statusText)
    if (e.response.statusText === "first byte timeout") {
      console.info("This error is usually caused by API response limits. You may want to " +
        "check to see if you can reduce the amount of data returned by limiting the objects per " +
        "request or limiting the fields/properties requested for those objects." +
        "\n\n" +
        "See https://docs.cosmicjs.com/rest-api/objects.html#get-objects");
    }
    return []
  }

  if (documents.data.objects) {
    objects = documents.data.objects
  } else {
    console.error(`${objectType} error: ${documents.data.message}`)
    console.timeEnd(timeLabel)
    return objects
  }

  // check if there's more that request limit of objects for object type
  if (documents.data.total && documents.data.total > batchSize) {
    // Query all data from endpoint
    // calculate number of calls to retrieve entire object type
    const additionalCallsRequired = Math.ceil(documents.data.total / batchSize) - 1
    for (let i = 0; i < additionalCallsRequired; i += 1) {
      // skip previously requested objects
      skip = skip + batchSize
      const skipEndpoint = apiEndpoint + `&skip=${skip}`
      // Query next batch from endpoint
      const response = await axios(skipEndpoint, axiosHeader)
      const responseSize = response.headers['content-length']
      if (debug) {
        console.info(`Cosmicjs Response size: (${objectType}) ${formatBytes(responseSize)}`)
      }
      if (responseSize > 4100000) {
        console.warn(`Cosmicjs response is close to API limit: (${objectType}) ${formatBytes(responseSize)}` +
          `\n` +
          `Consider using the "limit" param to reduce objects per request` +
          "\n"
        )
      }

      if (response.data.objects) {
        objects = _.concat(objects, response.data.objects)
      } else {
        console.error(`${objectType} fetch issue: ${response.message}`)
        break
      }
    }
  }
  console.log(
    `Fetched ${objects.length} ${
      objects.length === 1 ? 'object' : 'objects'
    } for object type: ${objectType}`
  )
  console.timeEnd(timeLabel)

  // Map and clean data.
  if (objects.length > 0) {
    objects = objects.map(item => clean(item))
  }
  return objects
}

/**
 * Remove fields starting with `_` symbol.
 *
 * @param {object} item - Entry needing clean
 * @returns {object} output - Object cleaned
 */
const clean = item => {
  _.forEach(item, (value, key) => {
    if (_.startsWith(key, `__`)) {
      delete item[key]
    } else if (_.isObject(value)) {
      item[key] = clean(value)
    }
  })
  return item
}

/**
 * Format byte value into human readable format.
 *
 * @param bytes
 * @param decimals
 * @return {string}
 */
const formatBytes =(bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
