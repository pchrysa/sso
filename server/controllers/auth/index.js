'use strict';
const fs = require('fs');
const Mustache  = require('mustache');
const Guid = require('guid');
const moment = require('moment');

const {clientId, webkit} = require('./../../../config').auth.facebook;
const {exchangeToken, userProfile, findAccountKitUser, registerAccountKitUser} = require('./../../actions');

const csrfGuid = Guid.raw();

const loadLogin = () => fs.readFileSync(__dirname + '/../../../public/index.html').toString();

const loadLoginSuccess = () => fs.readFileSync(__dirname + '/../../../public/loginSuccess.html').toString();

const loadLoginForm = async (ctx) => {
  const view = {
    appId: clientId,
    csrf: csrfGuid,
    version: webkit.version,
  };
  const html = Mustache.to_html(loadLogin(), view);
  ctx.body = html;
};

const loginOrSignup = async (ctx) => {
  const reqBody = ctx.request.body;
  const {csrfNonce, code, } = reqBody;
  
  if (csrfNonce !== csrfGuid) {
    ctx.throw(401, 'Unauthorized');
    return;
  }
  
  const exchangeTokenResponse = await exchangeToken({code});
  const userProfileResponse = await userProfile({
    access_token: exchangeTokenResponse.access_token
  });
  const view = {
    user_access_token: exchangeTokenResponse.access_token,
    expires_at: exchangeTokenResponse.expires_at || moment().add(1, 'hours'),
    user_id: exchangeTokenResponse.id,
    refresh_interval: exchangeTokenResponse.token_refresh_interval_sec,
  };
  if (userProfileResponse.phone) {
    view.mobile = userProfileResponse.phone.number;
  } else if (userProfileResponse.email) {
    view.email = userProfileResponse.email.address;
  }
  
  let user = await findAccountKitUser({...view});
  if (!user) {
    user = await registerAccountKitUser({...view});
  }
  
  const html = Mustache.to_html(loadLoginSuccess(), view);
  ctx.body = html;
  
};

module.exports = {
  loadLoginForm,
  loginOrSignup,
};