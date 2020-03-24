const axios = require('axios')
const queryString = require('query-string')
const _ = require('lodash')

module.exports = async ({
  apiURL,
  bucketSlug,
  objectType,
  apiAccess,
  preview,
}) => {
  const timeLabel = `Fetch Cosmic JS data for (${objectType})`
  const axiosHeader = {
    headers: { 'Accept-Encoding': 'gzip, deflate' },
  }
  let objects = []
  const limit = 1000
  let skip = 0
  console.time(timeLabel)
  console.log(`Starting to fetch data from Cosmic JS (${objectType})`)

  // Define URL params
  let urlParams = queryString.stringify({
    type: objectType,
    ...(preview && { status: 'all' }),
    ...(apiAccess && apiAccess.read_key && { read_key: apiAccess.read_key }),
  })

  // Define API endpoint.
  let apiEndpoint = `${apiURL}/${bucketSlug}/objects?${urlParams}&limit=${limit}`

  // Make API request.
  const documents = await axios(apiEndpoint, axiosHeader)

  if (documents.data.objects) {
    objects = documents.data.objects
  } else {
    console.error(`${objectType} error: ${documents.message}`)
    console.timeEnd(timeLabel)
    return objects
  }

  // check if there's more that request limit of objects for object type
  if (documents.data.total && documents.data.total > limit) {
    // Query all data from endpoint
    // calculate number of calls to retrieve entire object type
    const additionalCallsRequired = Math.ceil(documents.data.total / limit) - 1

    for (let i = 0; i < additionalCallsRequired; i += 1) {
      // skip previously requested objects
      skip = skip + limit
      const skipEndpoint = apiEndpoint + `&skip=${skip}`
      // Query next batch from endpoint
      const response = await axios(skipEndpoint, axiosHeader)
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
