# Gatsby Source for Cosmic JS

Source plugin for fetching data into [Gatsby](https://www.gatsbyjs.org) from [Cosmic JS](https://cosmicjs.com). Cosmic JS offers a [Headless CMS](https://cosmicjs.com/headless-cms) for your Gatsby website.

## Install

```
npm install --save gatsby-source-cosmicjs
```

## How to use

[Log into your Cosmic JS account](https://app.cosmicjs.com/login) to get your `bucketSlug` and `apiAcecss` keys.

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-cosmicjs`,
    options: {
      bucketSlug: ``, // Get this value in Bucket > Settings
      objectTypes: [`posts`],
      // If you have enabled read_key to fetch data (optional).
      apiAccess: {
        read_key: ``, // Get this value in Bucket > Settings
      },
      localMedia: true // Download media locally for gatsby image (optional)
    }
  },
]
```

## How to query and filter (Not Localized)

You can query the nodes created from Cosmic JS with the following:

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
    id
    slug
    title
  }
}
```

## How to use Gatsby Image

if `localMedia=true` in plugin config, you can use Gatsby Image.

#### Note: `gatsby-image` and `gatsby-source-filesystem` plugins are required. 

```graphql
{
  allCosmicjsPosts {
    edges {
      node {
        slug
        metadata{
          hero {
            local {
              childImageSharp {
                fluid(quality: 90, maxWidth: 1920) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
}
```
Read `gatsby-image` documentation here [here](https://www.gatsbyjs.org/packages/gatsby-image/).

## How to query (Localized)

```graphql
{
  allCosmicjsPosts(filter: {locale: {eq: "en"}}, sort: {fields: [published_at], order: DESC}) {
    edges {
      node {
        id
        slug
        title
        locale
      }
    }
  }
}
```

## Starters
Install the [Cosmic JS Gatsby starter](https://github.com/cosmicjs/gatsby-starter):
```
npm i cosmicjs -g
cosmic init gatsby-starter
cd gatsby-starter
cosmic start
```

Install the [Cosmic JS Gatsby localization starter](https://github.com/cosmicjs/gatsby-localization-starter):
```
npm i cosmicjs -g
cosmic init gatsby-starter
cd gatsby-localization-starter
cosmic start
```
