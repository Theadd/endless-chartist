var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',  //'eval',
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:3002',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  externals: {
    "chartist": "Chartist",
    "settings": "Settings"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      "lib": require.resolve("./src/lib")
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  }
}
