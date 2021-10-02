const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const chatClients = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    chatClients.push(resolve);
  });

  next();
});

router.post('/publish', async (ctx, next) => {
  const body = ctx.request.body;
  const trueReq = !!Object.keys(body).length && !!body.message?.trim()

  chatClients.forEach( (resolve) => {
    if (trueReq) {
      resolve(ctx.request.body.message);
    }
  });

  if (trueReq) {
    ctx.body = ctx.request.body.message;
  }
  else {
    ctx.throw(400);
  }

  next();
});

app.use(router.routes());

module.exports = app;
