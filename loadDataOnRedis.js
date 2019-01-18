const axios = require('axios');
const redis = require("redis");
const redisClient = redis.createClient();


redisClient.on("error", function (err) {
  console.log("Redis Error " + err);
});

const getData = async (url) => {
  const resp = await axios.get(url)
  if (resp.status === 200) {
    return resp.data
  } else {
    return []
  }
}

const loadDataOnRedis = async (url) => {
  const data = await getData(url)
  data.forEach((row) => {
    redisClient.hget('symbols', row.id, (err, record) => {
      if (err) return console.error('redisClient.hget', err)
      const prevRecord = JSON.parse(record)
      if (!prevRecord || prevRecord.current_price !== row.current_price) {
        redisClient.publish('cryptomoney-realtime', JSON.stringify(row))
        redisClient.hset('symbols', row.id, JSON.stringify(row), redis.print)
      }

    })
  });
}

const getSymbols = () => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall("symbols", function (err, replies) {
      if (replies) {
        resolve(Object.keys(replies)
          .map((item) => JSON.parse(replies[item]))
        )
      }
    });
  })
}



module.exports = { loadDataOnRedis, getSymbols };