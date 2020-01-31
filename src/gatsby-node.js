const fetchData = require('./fetch')
const { createNodeHelper, createEntityTypes } = require('./utils')
const { createGatsbyImageResolver } = require('./gatsby-image-resolver')

exports.sourceNodes = async (
  { actions, webhookBody, createContentDigest, getNode },
  {
    apiURL = 'https://api.cosmicjs.com/v1',
    bucketSlug = '',
    objectTypes = [],
    apiAccess = {},
    preview = false,
  }
) => {
  const { createNode, deleteNode, createTypes } = actions

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

  createEntityTypes(objectTypes, createTypes)

  const promises = objectTypes.map(objectType =>
    fetchData({
      apiURL,
      bucketSlug,
      objectType,
      apiAccess,
      preview,
    })
  )

  // Execute the promises.
  const data = await Promise.all(promises)

  // Create nodes.
  objectTypes.forEach((_item, i) => {
    var items = data[i]
    items.forEach(item => {
      createNodeHelper(item, helperObject)
    })
  })
}

exports.createResolvers = createGatsbyImageResolver
