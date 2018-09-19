import fetchData from './fetch'
import { Node } from './nodes'
import { mergeNames } from './utility'
import { capitalize } from 'lodash'

exports.sourceNodes = async (
  { boundActionCreators },
  {
    apiURL = 'https://api.cosmicjs.com/v1',
    bucketSlug = '',
    objectTypes = [],
    locales = [],
    apiAccess = {},
  }
) => {
  const { createNode } = boundActionCreators

  const isLocale = locales.length > 0

  if (isLocale) {
    locales.forEach(locale => {
      const item = {
        slug: locale.replace('-', '_'),
      }
      const node = Node('Locales', item)
      createNode(node)
    })
  }

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
    if (isLocale) {
      items = mergeNames(items, locales, 'slug')
    }
    items.forEach(item => {
      const node = Node(capitalize(objectType), item)
      createNode(node)
    })
  })
}
