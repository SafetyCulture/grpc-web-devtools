const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    app: "./client.js"
  },
  plugins: [
    new FilterWarningsPlugin({ 
      exclude: /Module not found/ 
    }),
    new HtmlWebpackPlugin({
      title: 'gRPC-Web Dev Tools Example'
    })
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    fs: "empty",
    WNdb: "empty",
    lapack: "empty"
  }
}