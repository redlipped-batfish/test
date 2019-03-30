const path = require('path');

module.exports = {
  entry: {
    login: './client/index.js',
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
  },
  mode: process.env.NODE_ENV,
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, '/build'),
    hot: true,
    proxy: {
      '/': 'http://localhost:3000',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /css/,
        exclude: /node_modules/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
