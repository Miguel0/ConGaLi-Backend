const ConnectionHandler = require('./connectionHandler')
const GeneralCommunicationHandler = require('./generalCommunicationHandler')

module.exports = function (io, storageHandler) {
  const cH = new ConnectionHandler(io, storageHandler)
  console.log(`Connection Handler created at ${cH.createdOn.toISOString()}`)

  const gCH = new GeneralCommunicationHandler(io, cH, storageHandler)
  console.log(`General Communication Handler created at ${gCH.createdOn.toISOString()}`)
}
