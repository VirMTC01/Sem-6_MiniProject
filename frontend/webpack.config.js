const path = require('path');

module.exports = {
  // Other webpack configurations...

  resolve: {
    fallback: {
      "zlib": false,
      "querystring": false,
      "crypto": false,
      "fs": false,
      "http": false,
      "net": false
    }
  }
};
