const path = require('path');

module.exports = {
  entry: './src/fastable.js',
  devtool: 'inline-source-map',
  mode: 'development',
  output: {
    filename: 'fastable.bundle.js',
    library: 'Fastable',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: {
                  loader: 'babel-loader',

              }
          }
      ]
  }
};