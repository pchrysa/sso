'use strict';
import Request from 'request';
import crypto from 'crypto';
import Querystring  from 'querystring';
import {auth} from 'config';

const {clientId, webkit} = auth.facebook;

const exchangeToken = async ({code}) => {
  const access_token = `AA|${clientId}|${webkit.secret}`;
  const params = {
    code,
    access_token,
    grant_type: 'authorization_code',
  };
  const url = `${webkit.urls.tokenExchange}?${Querystring.stringify(params)}`;
  
  try {
    return new Promise((resolve, reject) => {
      Request.get({
        url,
        json: true,
      }, (err, resp, respBody) => {
        if (err) {
          reject(err);
        }
        resolve(respBody);
      });
    });
  } catch(e) {
    throw e;
  }
};

const userProfile = async ({access_token}) => {
  const appSecretProof = crypto.createHmac('sha256', webkit.secret)
    .update(access_token)
    .digest('hex');
  
  const url = `${webkit.urls.me}?appsecret_proof=${appSecretProof}&access_token=${access_token}`;
  try {
    return new Promise((resolve, reject) => {
      Request.get({
        url,
        json: true,
      }, (err, resp, respBody) => {
        if (err) {
          reject(err);
        }
        resolve(respBody);
      });
    });
  } catch(e) {
    throw e;
  }
};

module.exports = {
  exchangeToken,
  userProfile,
};