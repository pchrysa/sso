require('babel-polyfill');
require('babel-core/register')({
  extensions: ['.es6', '.es', '.js'],
  presets: ['es2015-node6', 'stage-3'],
});

require('./app.js');