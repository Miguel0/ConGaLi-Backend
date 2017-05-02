module.exports = {
  port: 1996,
  hostName: 'localhost',
  handler: {
    connection: {
      deletingSocketDataInterval: 10000,
      useSocketByIp: false
    }
  }
}
