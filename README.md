# ConGali Backend

ConGaLi is an implementation of Conway's Game of Life [Conway’s Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) is a famous simulation that demonstrates cellular automaton. It is modeled as a grid with 4 simple rules:

1. **Any live cell with fewer than two live neighbours dies, as if caused by under-population.**
2. **Any live cell with two or three live neighbours lives on to the next generation.**
3. **Any live cell with more than three live neighbours dies, as if by overcrowding.**
4. **Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.**

This particular implementation creates a Multiplayer app version of Game of Life, with the following instructions as a foundational stone and premises (wich are relevant to backend services):

- **The game should tick automatically at a predefined interval, at say, 1 step per second.**
- **This server allows multiple clients to share the same, synchronized world view.**
- **Each client is assigned a random color on initialization.**
- **Creating a point on any grid will create a live cell on that grid with the client’s color. This change should be synchronized across all connected clients. (You can use any mechanism to achieve this, such as polling, comet or WebSocket).**
- **When a dead cell revives by rule #4 , it will be given a color that is the average of its neighbours (that revive it).**

## TODO list
- [x] **\(Originally requested)** The game should tick automatically at a predefined interval, at say, 1 step per second.
- [ ] **\(Originally requested)** This server allows multiple clients to share the same, synchronized world view.
- [x] **\(Originally requested)** Each client is assigned a random color on initialization.
- [x] **\(Originally requested)** Creating a point on any grid will create a live cell on that grid with the client’s color. This change should be synchronized across all connected clients. (You can use any mechanism to achieve this, such as polling, comet or WebSocket).
- [x] **\(Originally requested)** When a dead cell revives by rule #4 , it will be given a color that is the average of its neighbours (that revive it).
- [x] **\(Requirement enhancement)** _Give the creator of the Grid Cell to config the tick interval upon creation._
- [ ] **\(Requirement enhancement)** _Implement some kind of users authentication._
- [ ] **\(Requirement enhancement)** _Implement some kind of storage for users data._
- [ ] **\(Requirement enhancement)** _Implement an acceptable Application Error handling mechanism Across the App._
- [ ] **\(Requirement enhancement)** _Implement an acceptable logging mechanism across the App._
- [ ] **\(Requirement enhancement)** _Implement test for Models._
- [ ] **\(Requirement enhancement)** _Implement test for WebSockets endpoints._
- [ ] **\(Requirement enhancement)** _Get to a coverage of at least 70%._

## Build Setup

``` bash
# install dependencies
npm install

# serve at localhost:3000
npm run app

# run unit tests
npm run unit

# run coverage
npm coverage

# run all tests
npm test
```
