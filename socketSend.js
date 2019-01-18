const redis = require("redis");


const socketSend = (io) => {
  io.on('connection', (websocket) => {
    console.log('Usuario conectado')

    const redisClient = redis.createClient();
    redisClient.subscribe('cryptomoney-realtime')
    redisClient.on('message', (channel, message) => {
      console.log(JSON.parse(message).id);
      websocket.broadcast.emit(channel, message)
    })

    websocket.on('disconnect', () => {
      redisClient.unsubscribe()
      console.log('Usuario desconectado')
    })
  });
}

module.exports = socketSend