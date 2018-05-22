import axios from "axios"
import fetchData from "./fetch"
import { Node } from "./nodes"
import { capitalize } from "lodash"

exports.sourceNodes = async (
  { boundActionCreators },
  {
    apiURL = "https://api.cosmicjs.com/v1",
    bucketSlug = "",
    objectTypes = [],
    apiAccess = {},
  }
) => {
  const { createNode } = boundActionCreators

  // Generate a list of promises based on the `objectTypes` option.
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
    const items = data[i]

    items.forEach(item => {
      const node = Node(capitalize(objectType), item)
      createNode(node)
    })
  })
}
