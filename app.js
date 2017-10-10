'use strict';
/*eslint no-console: ["warn", { allow: ["warn", "error"] }] */
const Routes = require('./server/routes');
const Config = require('./config');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaConvert = require('koa-convert');
const KoaBodyParse = require('koa-bodyparser');
const Boom = require('boom');

require('./server/libs/mongoose');

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.info(err);
});

process.on('unhandledRejection', (reason, p) => {
  console.info(`Unhandled Rejection with ${reason} on Promise:`, p);
});

try {
  console.info('STARTING API');
  console.info('\tSTARTING SERVER...');
  console.info('\tENVIRONMENT:', process.env.NODE_ENV);
  
  global.config = Config;
  global.ROOTDIR = __dirname;
  
  const app = new Koa();
  
  const _use = app.use;
  app.use = (x) => _use.call(app, KoaConvert(x));
  
  app.keys = global.config.cookie_keys;
  
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.type = 'json';
      ctx.status = err.status || 500;
      ctx.body = {
        name: err.name,
        code: ctx.status,
        message: err.message || ctx.res.statusMessage,
        errors: Array.isArray(err.errors) ? err.errors : [],
      };
      ctx.app.emit('error', err, this);
    }
  });
  
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    ctx.set('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,' +
      'X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Pragma,Origin,' +
      'Authorization');
    ctx.set('Access-Control-Max-Age', 1728000);
    await next();
  });
  
  // x-response-time
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });
  
  // logger
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
  });
  
  app.use(KoaBodyParse());
  //  app.use(KoaStatic('./public'));
  
  const router = new KoaRouter();
  Routes(router);
  router.get('*', async (ctx) => {
    ctx.body = 'Not Found';
  });
  
  app.use(router.routes());
  app.use(router.allowedMethods({
    throw: true,
    notImplemented: () => new Boom.notImplemented(),
    methodNotAllowed: () => new Boom.methodNotAllowed(),
  }));
  
  const server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.info('API listening at http://%s:%s', host, port);
  });
  console.info('\tSERVER READY.');
  console.info('APP IS READY.');
} catch (e) {
  throw e;
}
