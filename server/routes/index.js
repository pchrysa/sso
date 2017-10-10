'use strict';
import {loadLoginForm, loginOrSignup} from 'controllers';

const init = (router) => {
  router.get('/', loadLoginForm);
  router.post('/exchange', loginOrSignup);
};

module.exports = init;