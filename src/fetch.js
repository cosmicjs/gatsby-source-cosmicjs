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
  let objects = []
  console.time(timeLabel)
  console.log(`Starting to fetch data from Cosmic JS (${objectType})`)

  // Define URL params
  let urlParams = queryString.stringify({
    type: objectType,
    ...(preview && { status: 'all' }),
    ...(apiAccess && apiAccess.read_key && { read_key: apiAccess.read_key }),
  })

  // Define API endpoint.
  let apiEndpoint = `${apiURL}/${bucketSlug}/objects?${urlParams}`

  // Make API request.
  const documents = await axios(apiEndpoint, {
    headers: { 'Accept-Encoding': 'gzip, deflate' },
  })

  if (documents.data.objects) {
    objects = documents.data.objects
  } else {
    console.error(`${objectType} error: ${documents.message}`)
    console.timeEnd(timeLabel)
    return objects
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
