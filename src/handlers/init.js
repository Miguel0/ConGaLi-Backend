const ConnectionHandler = require('./connectionHandler')
const GeneralCommunicationHandler = require('./generalCommunicationHandler')

module.exports = function (io, storageHandler) {
  const gCH = new GeneralCommunicationHandler(io, storageHandler)
  console.log(`General Communication Handler created at ${gCH.createdOn.toISOString()}`)

  const cH = new ConnectionHandler(io, gCH, storageHandler)
  console.log(`Connection Handler created at ${cH.createdOn.toISOString()}`)
}
