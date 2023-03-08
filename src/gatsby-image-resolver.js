var md5 = require('md5')

exports.createGatsbyImageResolver = (
  { actions, cache, createNodeId, createResolvers, getNode, store, reporter },
  { localMedia = false }
) => {
  if (localMedia) {
    const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
    const { createNode, touchNode } = actions

    // Add all media libary images so they can be queried by Gatsby Image
    createResolvers({
      CosmicjsLocalMedia: {
        local: {
          type: `File`,
          async resolve(source, _args, _context, _info) {
            if (source.url) {
              let fileNode
              const checksum = md5(source.value)

              // Set the file cacheID, get it (if it has already been set)
              const mediaDataCacheKey = `cosmicjs-media-${checksum}`
              const cacheMediaData = await cache.get(mediaDataCacheKey)

              // If we have cached media data and it wasn't modified, reuse
              if (cacheMediaData && checksum === cacheMediaData.checksum) {
                fileNode = getNode(cacheMediaData.fileNodeID)

                // check if node still exists in cache
                if (fileNode) {
                  touchNode({
                    ...fileNode,
                    // Keep nodeId to make it backward compatible
                    nodeId: fileNode.id,
                  })
                }
              }

              // If we don't have cached data, download the file
              if (!fileNode) {
                try {
                  // Get the filenode
                  fileNode = await createRemoteFileNode({
                    url: source.url,
                    store,
                    cache,
                    createNode,
                    createNodeId,
                    reporter,
                  })

                  if (fileNode) {
                    const fileNodeID = fileNode.id

                    await cache.set(mediaDataCacheKey, {
                      fileNodeID,
                      checksum: checksum,
                    })
                  }
                } catch (e) {
                  // Ignore
                  console.log(e)
                  return null
                }
              }

              if (fileNode) {
                return fileNode
              }
            }
            return null
          },
        },
      },
    })
  }
}
