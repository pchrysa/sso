'use strict';

const fs = require('fs');
const path = require('path');

const defaults = require('./global');
let envConfigs = null;

/* Load Local Config By Default */
let env = 'local';
if(/(prod|production)/gi.test( process.env.NODE_ENV )) {
  env = 'prod';
} else {
  env = process.env.NODE_ENV || env;
}

if (env) {
  let envPath = '/' + env + '.js';
  let absPath = path.resolve(__dirname + envPath);
  let fileExists = fs.existsSync(absPath);
  if (fileExists) {
    envConfigs = require('./'+env);
  }
}

let rootPath  = path.resolve(__dirname + '/../');
defaults.root_path = rootPath;


const configs = envConfigs ? {...defaults, ...envConfigs} : {...defaults};

module.exports = configs;
