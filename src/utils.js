const _ = require('lodash')
var md5 = require('md5')
const { processObject } = require('./normalize')
const isImage = require('is-image')

const generateTypeSlug = slug => {
  let typeSlug = _.camelCase(slug)
  typeSlug = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1)
  return typeSlug
}

const createMediaNode = (
  metadata,
  metafield,
  { createContentDigest, createNode }
) => {
  if (
    metafield.type == 'file' &&
    metafield.url &&
    metafield.url.startsWith('https://cdn.cosmicjs.com') &&
    isImage(metafield.url)
  ) {
    const { value, url, imgix_url, key } = metafield
    const id = md5(metafield.value)
    let media = {
      _id: id,
      value,
      url,
      imgix_url,
    }
    const node = processObject('LocalMedia', media, createContentDigest)
    createNode(node)
    metadata[`${key}___NODE`] = id
    delete metadata[key]
  }
}

const createMediaArray = (item, helperObject) => {
  /* Check for base case */
  if (item.metafields === undefined || item.metafields === null) {
    return item
  }
  item.metafields.forEach(metafield => {
    // If file, create media node
    if (metafield.type == 'file')
      createMediaNode(item.metadata, metafield, helperObject)
    // Process object
    // if (metafield.type === 'object' && metafield.object) {
    //   item.metadata[metafield.key] = createMediaArray(
    //     metafield.object,
    //     helperObject
    //   )
    // }
    // // Process objects
    // if (
    //   metafield.type === 'objects' &&
    //   metafield.objects &&
    //   Array.isArray(metafield.objects)
    // ) {
    //   for (let i = 0; metafield.objects.length > i; i += 1) {
    //     item.metadata[metafield.key][i] = createMediaArray(
    //       metafield.objects[i],
    //       helperObject
    //     )
    //   }
    // }
  })
  return item
}

exports.createNodeHelper = (item, helperObject) => {
  const { createContentDigest, createNode, localMedia } = helperObject
  if (localMedia) {
    item = createMediaArray(item, helperObject)
  }
  let typeSlug = generateTypeSlug(item.type_slug)
  const node = processObject(typeSlug, item, createContentDigest)
  createNode(node)
}
