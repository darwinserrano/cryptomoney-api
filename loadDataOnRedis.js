const axios = require('axios');
const redis = require("redis");
const client = redis.createClient();

const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,bitcoin-cash,eos,stellar,litecoin,cardano,monero,tether,tron,dash,iota,neo,ethereum-classic'

client.on("error", function (err) {
  console.log("Redis Error " + err);
});

const getData = async () => {
  const resp = await axios.get(url)
  if (resp.status === 200) {
    return resp.data
  } else {
    return []
  }
}

const loadDataOnRedis = async () => {
  const data = await getData()
  data.forEach((row) => {
    client.hget('symbols', row.id, (err, record) => {
      const prevRecord = JSON.parse(record)
      if (!prevRecord || prevRecord.current_price !== row.current_price) {
        client.hset('symbols', row.id, JSON.stringify(row), redis.print)
        client.publish('cryptomoney-realtime', JSON.stringify(row))
      }

    })
  });
}

const getSymbols = () => {
  return new Promise((resolve, reject) => {
    client.hgetall("symbols", function (err, replies) {
      if (replies) {
        resolve(Object.keys(replies)
          .map((item) => JSON.parse(replies[item]))
        )
      }
    });
  })
}



module.exports = { loadDataOnRedis, getSymbols };