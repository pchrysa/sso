'use strict';
const {loadLoginForm, loginOrSignup} = require('./../controllers');

const init = (router) => {
  router.get('/', loadLoginForm);
  router.post('/exchange', loginOrSignup);
};

module.exports = init;