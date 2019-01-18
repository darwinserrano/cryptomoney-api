const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const cors = require('@koa/cors');
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const socketSend = require('./socketSend')
const { loadDataOnRedis, getSymbols } = require('./loadDataOnRedis')
const config = require('./config')

app.use(json());
app.use(cors())

app.use(async ctx => {
  ctx.response.body = await getSymbols()
});

socketSend(io)

server.listen(5000);

config.availableServices.forEach((service) => {
  setInterval(() => {
    loadDataOnRedis(service.url)
  }, service.reloadOnMilliseconds);
});