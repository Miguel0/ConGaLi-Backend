let Board = require('../../../../src/model/CellsGrid')
let Cell = require('../../../../src/model/ContextUnawareCell')

describe('CellsGrid', function () {
  let board
  let cell

  beforeEach(() => {
    board = new Board()
    cell = new Cell()
  });

  it('should be able to be created', function () {
  	board = null
  	cell = null
  });

});
