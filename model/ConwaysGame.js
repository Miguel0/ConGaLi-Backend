function ConwaysGame () {
    this.createdOn = new Date();
    this.name = null;
    this.refreshInterval = 1000;
    this.boards = [];
    this.users = {};

    function createCellBy(user, x, y) {
        this.addCell(new BlindCell(), x, y);
    }

    function killCellBy(user, x, y) {
        this.removeCell(x, y);
    }

    function toJSONObject() {
        let json = {};
        json.createdOn = this.createdOn.toISOString();
        json.name = this.name;
        json.boards = [];

        for (var i = 0; i < this.boards.length; i++) {
            json.boards[i] = this.boards[i].toJSONObject();
        }

        return json;
    }
}

module.exports = ConwaysGame;