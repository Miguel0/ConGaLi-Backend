class GeneralCommunicationHandler {
  constructor (io, connectionHandler, storageHandler) {
    this.createdOn = new Date()

    io.on('availableGames', function (socket) { return this.retrieveAvailableGamesDescription(connectionHandler) })
  }

  retrieveAvailableGamesDescription (connectionHandler) {
    let games = []

    for (let socketConnected in connectionHandler.socketsConnected) {
      if (socketConnected.gameHandler) {
        games.push(socketConnected.gameHandler.getDescriptiveJSONObject())
      }
    }

    return games
  }
}

module.exports = GeneralCommunicationHandler
