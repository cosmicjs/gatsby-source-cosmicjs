import axios from 'axios'
import { isObject, startsWith, forEach, concat } from 'lodash'

module.exports = async ({ apiURL, bucketSlug, objectType, apiAccess }) => {
  const timeLabel = `Fetch Cosmic JS data for (${objectType})`
  console.time(timeLabel)
  console.log(`Starting to fetch data from Cosmic JS (${objectType})`)
  let objects = []
  const limit = 1000
  let skip = 0
  // Define API endpoint.
  let apiEndpoint = `${apiURL}/${bucketSlug}/objects?type=${objectType}`

  if (apiAccess.hasOwnProperty('read_key') && apiAccess.read_key.length !== 0) {
    apiEndpoint = apiEndpoint + `&read_key=${apiAccess.read_key}`
    apiEndpoint = apiEndpoint + `&limit=${limit}`
  }

  // Make initial API request.
  const documents = await axios(apiEndpoint)

  // Check for empty object type
  if (documents.data.objects === undefined) {
    console.error(`${objectType} error: ${documents.message}`)
    console.timeEnd(timeLabel)
    return objects
  }

  if (documents.data.objects) {
    objects = documents.data.objects
  }

  // check if there's more that request limit of objects for object type
  if (documents.data.total && documents.data.total > limit) {
    // Query all data from endpoint
    // calculate number of calls to retrieve entire object type
    const additionalCallsRequired = Math.ceil(documents.data.total / limit) - 1

    for (let i = 0; i < additionalCallsRequired; i += 1) {
      // skip previously requested objects
      skip = skip + limit
      let skipEndpoint = apiEndpoint + `&skip=${skip}`
      // Query next batch from endpoint
      let response = await axios(skipEndpoint)
      if (response.data.objects) {
        objects = concat(objects, response.data.objects)
      } else {
        console.error(`${objectType} fetch issue: ${documents.message}`)
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
  forEach(item, (value, key) => {
    if (startsWith(key, `__`)) {
      delete item[key]
    } else if (isObject(value)) {
      item[key] = clean(value)
    }
  })

  return item
}
