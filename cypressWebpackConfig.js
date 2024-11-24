const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.cy'],
    alias: {
      '@pages': path.resolve(__dirname, './cypress/support/pages/'),
      '@selectors': path.resolve(__dirname, './cypress/support/selectors/')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
};
