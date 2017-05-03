module.exports = {
  port: 3000,
  hostName: 'localhost',
  handler: {
    connection: {
      deletingSocketDataInterval: 10000,
      useSocketByIp: false
    }
  }
}
