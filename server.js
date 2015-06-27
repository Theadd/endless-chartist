var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3002, '127.0.0.1', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at http://127.0.0.1:3002');
});
