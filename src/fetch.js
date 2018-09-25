import axios from 'axios'
import { isObject, startsWith, forEach } from 'lodash'

module.exports = async ({ apiURL, bucketSlug, objectType, apiAccess }) => {
  console.time('Fetch Cosmic JS data')
  console.log(`Starting to fetch data from Cosmic JS (${objectType})`)

  // Define API endpoint.
  let apiEndpoint = `${apiURL}/${bucketSlug}/objects?type=${objectType}`

  if (apiAccess.hasOwnProperty('read_key') && apiAccess.read_key.length !== 0) {
    apiEndpoint = apiEndpoint + `&read_key=${apiAccess.read_key}`
  }
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
  forEach(item, (value, key) => {
    if (startsWith(key, `__`)) {
      delete item[key]
    } else if (isObject(value)) {
      item[key] = clean(value)
    }
  })

  return item
}
