class GeneralCommunicationHandler {
  constructor (io, storageHandler) {
    this.createdOn = new Date()
  }

  configureSocketUponConnection (socket) {
    socket.on('getAvailableGames', () =>  socket.emit('receiveAvailableGames', this.retrieveAvailableGamesDescription()))
  }

  retrieveAvailableGamesDescription () {
    let games = []
    console.log('searching game definitions')

    for (let socketConnectedKey in this.connectionHandler.socketsConnected) {
      let socketData = this.connectionHandler.socketsConnected[socketConnectedKey]

      if (socketData.gameHandler && socketData.gameHandler.game) {
        games.push(socketData.gameHandler.game.getDescriptiveJSONObject())
      }
    }

    console.log(`games calculated:${JSON.stringify(games)}`)
    return games
  }
}

module.exports = GeneralCommunicationHandler
