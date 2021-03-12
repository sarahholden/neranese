const path = require('path');

module.exports = {
  mode: 'production',
  entry: '/js/theme.js',
  optimization: {
		// During development - don't minify
		// minimize: false
	},
  output: {
    path: path.resolve(__dirname, './assets'),
    filename: 'theme.min.js',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: [path.resolve(__dirname, '/js')],
        loader: 'eslint-loader',
      },
      {
        test: /\.js?$/,
        include: [path.resolve(__dirname, '/js')],
        loader: 'babel-loader',
      },
    ],
  },
};
