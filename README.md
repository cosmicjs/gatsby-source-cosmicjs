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

## How to query

You can query the nodes created from Cosmic JS like the following:

```graphql
{
  allCosmicjsPosts {
    edges {
      node {
        id
        title
      }
    }
  }
}
```
