const redis = require("redis");
const client = redis.createClient();

const socketSend = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    client.subscribe('cryptomoney-realtime')

    client.on('message', (channel, message) => {
      console.log(JSON.parse(message).id);
      socket.emit(channel, message)
    })
  });

}

module.exports = socketSend