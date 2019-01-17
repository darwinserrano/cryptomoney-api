const redis = require("redis");
const client = redis.createClient();

const socketSend = (io) => {
  let socket = null
  io.on('connection', (socketNew) => {
    socket = socketNew
    console.log('a user connected');
  });

  client.subscribe('cryptomoney-realtime')

  client.on('message', (channel, message) => {
    console.log(JSON.parse(message).id);
    if (socket) socket.emit(channel, message)
  })

}

module.exports = socketSend