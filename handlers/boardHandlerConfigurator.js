function BoardHandlerConfigurator ( io, storageHandler, socket ) {
    this.board = null;
    this.boardTickHandler = null;
    this.socket = socket;
    this.nameSpace = null;

    function startGame(client) {
        this.boardTickHandler = setInterval(
            () => {
                //TODO handle exceptions to avoid memory leaks
                socket.broadcast.emit('refreshBoard', {});
            },
            board.refreshInterval);

        this.nameSpace.on('forceEnd', forceStopGame);
    }

    function forceStopGame() {
        clearInterval(this.boardTickHandler);
    }

    function addUser() {
        
    }

    function removeUser() {
        
    }

    function updateUser() {
        
    }

    function updateConfiguration() {
        
    }
     
    function createBoard(data) {
        this.board = require('./model/Board.js');
        this.board.name = data;

        this.nameSpace = io.of(this.board.name);

        this.socket.join(
            this.nameSpace,
            () => {
                this.nameSpace.on('startGame', startGame);
                this.nameSpace.on('updateConfiguration', updateConfiguration);
                this.nameSpace.on('addUser', addUser);
                this.nameSpace.on('removeUser', removeUser);
                this.nameSpace.on('updateUser', updateUser);
            }
        );
    }
}

module.exports = BoardHandlerConfigurator;