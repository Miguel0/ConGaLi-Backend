function ConwaysGameHandlerConfigurator ( io, storageHandler, socket ) {
    this.game = null;
    this.gameTickHandler = [];
    this.socket = socket;
    this.nameSpace = null;

    function startGame(client, boardId) {
        for (let i = 0; i < this.game.boards.length; i++) {
            this.gameTickHandler[i] = setInterval(
                () => {
                    socket.broadcast.emit('refreshBoard', this.game.refreshBoard(boardId).toJSONObject());
                },
                this.game.refreshInterval);
        }

        this.nameSpace.on('forceEnd', forceStopGame);
    }

    function forceStopGame(boardId) {
        for (let i = 0; i < this.game.boards.length; i++) {
            clearInterval(this.gameTickHandler[i]);
        }
    }

    function addUser() {
        
    }

    function removeUser() {
        
    }

    function updateUser() {
        
    }

    function updateConfiguration() {
        
    }

    function createCell(data) {
        this.board.createCellBy(data.user, data.x, data.y);
    }

    function killCell() {
        this.board.KillCellBy(data.user, data.x, data.y);
    }

    function createGame(data) {
        this.game.name = data.name;

        this.nameSpace = io.of(this.game.name);

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

    function createBoard(data) {
        this.board = require('./model/Board.js')();
        this.board.name = data;

        this.nameSpace = io.of(this.game.name);

        this.socket.join(
            this.nameSpace,
            () => {
                this.nameSpace.on('startGame', startGame);
                this.nameSpace.on('updateConfiguration', updateConfiguration);
                this.nameSpace.on('addUser', addUser);
                this.nameSpace.on('removeUser', removeUser);
                this.nameSpace.on('updateUser', updateUser);
                this.nameSpace.on('createCell', createCell);
                this.nameSpace.on('killCell', killCell);
            }
        );
    }
}

module.exports = ConwaysGameHandlerConfigurator;