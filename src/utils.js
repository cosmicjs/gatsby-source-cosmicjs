const _ = require('lodash')
var md5 = require('md5')
const { processObject } = require('./normalize')

const generateTypeSlug = slug => {
  let typeSlug = _.camelCase(slug)
  typeSlug = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1)
  return typeSlug
}

const createMediaArray = (item, { createContentDigest, createNode }) => {
  var images = []
  item.metafields.forEach(metafield => {
    if (
      metafield.type == 'file' &&
      metafield.url &&
      metafield.url.startsWith('https://cdn.cosmicjs.com')
    ) {
      const id = md5(metafield.value)
      metafield._id = id
      const node = processObject('LocalImages', metafield, createContentDigest)
      createNode(node)
      delete metafield._id
      metafield.id = id
      images.push(metafield)
    }
  })
  item.images = images
  return item
}

exports.createNodeHelper = (item, helperObject) => {
  const { createContentDigest, createNode } = helperObject
  item = createMediaArray(item, helperObject)
  let typeSlug = generateTypeSlug(item.type_slug)
  const node = processObject(typeSlug, item, createContentDigest)
  createNode(node)
}

exports.createEntityTypes = (objectTypes, createTypes) => {
  createTypes(`
    type CosmicjsLocalImages implements Node {
      localImage: File
    }
  `)

  objectTypes.forEach((objectType, i) => {
    let typeSlug = generateTypeSlug(objectType)
    createTypes(`
      type Cosmicjs${typeSlug} implements Node {
        images: [CosmicjsLocalImages]
      }
    `)
  })
}
