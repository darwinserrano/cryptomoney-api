module.exports = {
  availableServices: [
    {
      name: 'api.coingecko.com',
      url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,bitcoin-cash,eos,stellar,litecoin,cardano,monero,tether,tron,dash,iota,neo,ethereum-classic',
      reloadOnMilliseconds: 5 * 1000
    }
  ]
}