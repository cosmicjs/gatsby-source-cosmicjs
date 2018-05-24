# gatsby-source-cosmicjs

Source plugin for fetching data into Gatsby from Cosmic JS.

## Install

`npm install --save gatsby-source-cosmicjs`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-cosmicjs`,
    options: {
      bucketSlug: ``,
      objectTypes: [`posts`],
      // If you have enabled read_key to fetch data (optional).
      apiAccess: {
        read_key: ``,
      }
    }
  },
]
```

## How to query and filter

You can query the nodes and created from Cosmic JS like the following:

```graphql
{
  allCosmicjsPosts {
    edges {
      node {
        id
        slug
        title
      }
    }
  }
}
```

and you can filter specific node using this:

```graphql
{
  cosmicjsPosts(slug: {eq: ''}) {
    edges {
      node {
        slug
        title
      }
    }
  }
}
```