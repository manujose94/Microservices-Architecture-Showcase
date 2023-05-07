const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: './src/server.js',
  target: 'node',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [NodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      }
    ],
  },
  plugins: [
    // Cleans the dist folder before each build
    new CleanWebpackPlugin(),
  ],
};
