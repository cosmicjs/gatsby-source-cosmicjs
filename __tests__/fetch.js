"use strict";

jest.mock('axios');

const axios = require('axios');

const fetch = require('../fetch');

const getArgs = (additional = {}) => Object.assign({
  apiURL: `https://api.cosmicjs.com`,
  bucketSlug: `hello-world`,
  objectType: `posts`
}, additional);

test('it passes read_key, if defined', async () => {
  axios.mockResolvedValueOnce({
    data: {
      objects: []
    }
  });
  const read_key = `hunter2`;
  await fetch(getArgs({
    apiAccess: {
      read_key
    }
  }));
  expect(axios).toHaveBeenCalledWith(expect.stringContaining(`read_key=hunter2`));
});