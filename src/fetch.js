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
  console.time('Fetch Cosmic JS data')
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
  const documents = await axios(apiEndpoint)

  // Query all data from endpoint
  console.timeEnd('Fetch Cosmic JS data')

  // Map and clean data.
  if (documents.data.objects) {
    return documents.data.objects.map(item => clean(item))
  } else {
    return []
  }
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
