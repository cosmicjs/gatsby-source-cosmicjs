import fetchData from './fetch'
import { processObject } from './normalize'
import { capitalize } from 'lodash'

const createNodeHelper = (item, { createContentDigest, createNode }) => {
  const node = processObject(
    capitalize(item.type_slug),
    item,
    createContentDigest
  )
  createNode(node)
}

exports.sourceNodes = async (
  { actions, webhookBody, createContentDigest, getNode },
  {
    apiURL = 'https://api.cosmicjs.com/v1',
    bucketSlug = '',
    objectTypes = [],
    apiAccess = {},
  }
) => {
  const { createNode, deleteNode } = actions

  const helperObject = {
    createContentDigest,
    createNode,
  }

  /*
   * Gatsby preview code path!
   */
  if (webhookBody && webhookBody.type) {
    const item = webhookBody.data
    switch (webhookBody.type) {
      case 'object.deleted':
        if (Array.isArray(item) && item.length) {
          for (const id of item) {
            deleteNode({
              node: getNode(id),
            })
          }
        }
        break
      case 'object.created.draft':
      case 'object.created.published':
      case 'object.edited.draft':
      case 'object.edited.published':
        createNodeHelper(item, helperObject)
        break
      default:
        break
    }
    return
  }

  /*
   * The existing, non-preview code path!
   */
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
      createNodeHelper(item, helperObject)
    })
  })
}
