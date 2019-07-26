import fetchData from './fetch'
import { processObject } from './normalize'
import { capitalize } from 'lodash'

exports.sourceNodes = async (
  { actions, createContentDigest },
  {
    apiURL = 'https://api.cosmicjs.com/v1',
    bucketSlug = '',
    objectTypes = [],
    apiAccess = {},
  }
) => {
  const { createNode } = actions

  const promises = objectTypes.map(objectType =>
    fetchData({
      apiURL,
      bucketSlug,
      objectType,
      apiAccess,
    })
  )

  // Execute the promises.
  const data = await Promise.all(promises)

  // Create nodes.
  objectTypes.forEach((objectType, i) => {
    var items = data[i]
    items.forEach(item => {
      const node = processObject(
        capitalize(objectType),
        item,
        createContentDigest
      )
      createNode(node)
    })
  })
}
