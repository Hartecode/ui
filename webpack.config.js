'use strict';

module.exports = require('./webpack.defaults')({
    // options
    __dirname: __dirname,
    entry: ['./src/standalone.es6'],
    output: {publicPath: '/', filename: 'standalone.js'}
});
