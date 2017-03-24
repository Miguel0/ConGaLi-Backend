const ConnectionHandler = require('./connectionHandler.js')

module.exports = function (io, storageHandler) {
  const cH = new ConnectionHandler(io, storageHandler)
  console.log(`Connection Handler created at ${cH.createdOn.toISOString()}`)
}
