const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = env => {
  const mode = env.mode;
  const isDevelopment = mode == 'development';

  return {
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },

    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      ]
    },

    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'styled-components': 'styled'
    },

    plugins: [
      new CopyWebpackPlugin([
        {
          from: isDevelopment
            ? './node_modules/react/umd/react.development.js'
            : './node_modules/react/umd/react.production.min.js',
          to: 'react.js'
        },
        {
          from: isDevelopment
            ? './node_modules/react-dom/umd/react-dom.development.js'
            : './node_modules/react-dom/umd/react-dom.production.min.js',
          to: 'react-dom.js'
        },
        {
          from: isDevelopment
            ? './node_modules/styled-components/dist/styled-components.js'
            : './node_modules/styled-components/dist/styled-components.min.js',
          to: 'styled-components.js'
        }
      ])
    ]
  };
};
