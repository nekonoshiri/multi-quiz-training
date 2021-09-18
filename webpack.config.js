const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/ts/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [path.resolve(__dirname, 'src', 'ts'), 'node_modules']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ]
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'styled-components': 'styled'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
