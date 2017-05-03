const process = require('process')

module.exports = {
  port: process.env.PORT || 3000,
  hostName: 'localhost',
  handler: {
    connection: {
      deletingSocketDataInterval: 10000,
      useSocketByIp: false
    }
  }
}
