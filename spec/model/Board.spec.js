describe("Board", function() {
  var Board = require('../../model/Board');
  var Cell = require('../../model/ConwaysBlindCell');
  var board;
  var cell;

  beforeEach(() => {
    board = new Board();
    cell = new Cell();
  });

  it("should be able to be created", function() {
    player.play(song);
    expect(player.currentlyPlayingSong).toEqual(song);

    //demonstrates use of custom matcher
    expect(player).toBePlaying(song);
  });

});
