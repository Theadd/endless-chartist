var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js'
  },
  externals: {
    "chartist": "Chartist",
    "settings": "Settings"
  },
  plugins: [
    /*new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compressor: {
        sequences: true,
        properties: true,
        dead_code: true,
        drop_debugger: true,
        unsafe: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        warnings: false,
        //drop_console: true,
        negate_iife: true
      }
    }),*/
    new webpack.optimize.DedupePlugin()
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      "lib": require.resolve("./src/lib")
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        include: path.join(__dirname, 'src')
      },
      {
        test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  }
}
