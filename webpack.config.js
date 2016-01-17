var path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, './index.js'),
  ],
  output: {
    path: path.resolve(__dirname, './dist/font-awesome'),
    filename: 'plugin.js',
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};
