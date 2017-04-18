exports = {
  port: 1996,
  hostName: 'the.host.uri',
  handler: {
    connection: {
      deletingSocketDataInterval: 10000,
      useSocketByIp: false
    }
  }
}