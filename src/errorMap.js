const pluginPrefix = 'gatsby-source-cosmicjs'

function prefixId(id) {
  return `${pluginPrefix}_${id}`
}

const ReporterLevel = {
  Error = 'ERROR',
}

const ReporterCategory = {
  // Error caused by user (typically, site misconfiguration)
  User = 'USER',
  // Error caused by Sanity plugin ("third party" relative to Gatsby Cloud)
  ThirdParty = 'THIRD_PARTY',
  // Error caused by Gatsby process
  System = 'SYSTEM',
}

const CODES = {
  MissingBucketSlug: '10000',
}

const ERROR_MAP = {
  [CODES.MissingBucketSlug]: {
    text: (context) => context.sourceMessage,
    level: ReporterLevel.Error,
    category: ReporterCategory.User,
  },
}

module.exports = {
    CODES,
    ERROR_MAP,
    pluginPrefix,
    prefixId
}