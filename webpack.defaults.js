'use strict';

var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (options) {
  options = _.defaults({}, options, {
    __dirname: __dirname,
    entry: ['./client/index.es6'],
    externalStylesheet: true,
    hotloadPort: 8888
  });

  options.output = _.defaults({}, options.output, {
    publicPath: '/static/',
    filename: 'client.js'
  });

  options.output.path =
    path.join(options.__dirname, options.output.publicPath + '/build/')

  var HOTLOAD = process.env.NODE_ENV === 'development';

  var loaders = {
    es6: {
      test: /\.(es6|jsx?)$/,
      loader:'babel',
      query: {
        presets: ['es2015', 'react', 'stage-0']
      },
      exclude: /node_modules/
    },

    json: {
      test: /\.json$/,
      loaders: ['json']
    },

    less: {
      test: /\.less$/,
      loader:
        options.externalStylesheet ?
          ExtractTextPlugin.extract(
            'css!autoprefixer!less', { publicPath: './static/build/' })
        : 'style!css!autoprefixer!less'
    },

    markdown: {
      test: /\.md$/,
      loaders: ['html', 'remarkable']
    },

    svg: {
      test: /\.svg$/,
      loader: 'html'
    },

    txt: {
      test: /\.txt$/,
      loader: 'text'
    }
  }

  var webpackConfig = {
    cache: true,
    devtool: 'source-map',
    entry: options.entry,
    noParse: [/moment\.js/],
    module: {
      loaders: [
        loaders.es6,
        loaders.json,
        loaders.less,
        loaders.markdown,
        loaders.svg,
        loaders.txt
      ]
    },
    output: {
      path: path.join(options.__dirname, options.output.publicPath + '/build/'),
      publicPath: options.output.publicPath,
      filename: options.output.filename
    },
    plugins: [],
    resolve: {
      extensions: ['', '.js', '.jsx', '.es', '.es6'],
      alias: { app: path.join(options.__dirname, 'client') }
    },
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')},
    target: 'web',

    // Hotload specific customization
    displayName: options.displayName,
    hotloadPort: options.hotloadPort,

    // Loader specific customization
    remarkable: {
      preset: 'full',
      html: true
    }
  };

  if (HOTLOAD) {
    webpackConfig.devtool = 'eval-source-map'; // This is not as dirty as it looks. It just generates source maps without being crazy slow.
    webpackConfig.entry = [
      'webpack-dev-server/client?http://localhost:' + webpackConfig.hotloadPort,
      'webpack/hot/dev-server',
    ].concat(webpackConfig.entry);

    webpackConfig.output.publicPath = 'http://localhost:' +
                                        webpackConfig.hotloadPort +
                                        webpackConfig.output.publicPath;
    loaders.es6.loaders = ['react-hot', 'babel'];
    loaders.less.loader = 'style!css!autoprefixer!less';

    webpackConfig.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
      })
    ];
  }
  else {
    if (options.externalStylesheet) {
      webpackConfig.plugins.push(
        // Adds support for 'require(*.less)' from '.jsx' files
        new ExtractTextPlugin(
            'style', 'main.css', {disable: false, allChunks: true}));
    }

    webpackConfig.plugins.push(
      new webpack.optimize.OccurenceOrderPlugin());

    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({warnings: false, comments: false}));

    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }));
  }

  return webpackConfig;
};
