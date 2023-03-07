# IMPORTANT
This repo is now deprecated. Please see the new home of the Cosmic Gatsby source plugin at [https://www.npmjs.com/package/@cosmicjs/gatsby-source-cosmic](https://www.npmjs.com/package/@cosmicjs/gatsby-source-cosmic).

# Gatsby Source for Cosmic

Source plugin for fetching data into [Gatsby](https://www.gatsbyjs.org) from [Cosmic](https://cosmicjs.com). Cosmic offers a [Headless CMS](https://cosmicjs.com/headless-cms) for your Gatsby website.

## Install

```
npm install --save gatsby-source-cosmicjs
```

## How to use

[Log into your Cosmic account](https://app.cosmicjs.com/login) to get your `bucketSlug` and `apiAcecss` keys.

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
      localMedia: true, // Download media locally for gatsby image (optional)
      limit: 1000, // The number of Objects to fetch on each request (optional)
      debug: false, // Optional: will output details about the API requests to Cosmic
    }
  },
]
```

### Advanced configuration

For more control over how content is sourced from Cosmic, you can provide object type overrides
in the plugin configuration. This can be useful if you are coming up against API limits, or are
trying to performance tune your builds. Use at your own risk!

[Get Objects API documentation](https://docs.cosmicjs.com/rest-api/objects.html#get-objects)

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-cosmicjs`,
    options: {
      bucketSlug: ``, // Get this value in Bucket > Settings
      objectTypes: [
        // Basic usage: define objectType as a string
        `posts`, 
        // Advanced usage: define objectType as an object
        { 
          type: `news`, // required
          params: { // any valid API parameter can be used. YMMV!
            hide_metafields: true, // hides metafields, which can get pretty large. You should only need metadata
            limit: 100, // this will override the limit only for this object type
          },
        },
      ],
      // If you have enabled read_key to fetch data (optional).
      apiAccess: {
        read_key: ``, // Get this value in Bucket > Settings
      },
      localMedia: true, // Download media locally for gatsby image (optional)
      limit: 1000, // The number of Objects to fetch on each request (optional)
      debug: false, // Optional: will output details about the API requests to Cosmic
    }
  },
]
```

### Debugging

Use the `debug: true` flag in your config to get more information about the build. This will provide:

- Exact Cosmic API endpoint being used for each object type
- Response size returned from Cosmic for the request

## How to query and filter (Not Localized)

You can query the nodes created from Cosmic with the following:

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
Install the [Cosmic Gatsby starter](https://github.com/cosmicjs/gatsby-starter):
```
npm i cosmicjs -g
cosmic init gatsby-starter
cd gatsby-starter
cosmic start
```

Install the [Cosmic Gatsby localization starter](https://github.com/cosmicjs/gatsby-localization-starter):
```
npm i cosmicjs -g
cosmic init gatsby-starter
cd gatsby-localization-starter
cosmic start
```
