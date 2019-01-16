const redis = require("redis");
const client = redis.createClient();

const socketSend = (io) => {
  let socket = null
  io.on('connection', (socket) => {
    console.log('a user connected');

    client.subscribe('cryptomoney-realtime')

    client.on('message', (channel, message) => {
      console.log(channel)
      socket.emit(channel, message)
    })
  });

}

module.exports = socketSend