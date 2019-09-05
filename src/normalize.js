exports.processObject = (type, item, createContentDigest) => {
  const id = item._id
  delete item._id
  const nodeMetadata = {
    id,
    parent: null,
    children: [],
    internal: {
      type: `Cosmicjs${type}`,
      content: JSON.stringify(item),
      contentDigest: createContentDigest(item),
    },
  }
  return Object.assign({}, item, nodeMetadata)
}
