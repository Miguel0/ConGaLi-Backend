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
- **Creating a point on any grid will create a live cell on that grid with the client’s color. This change should be synchronized across all connected clients. (Using any mechanism to achieve this, such as polling, comet or WebSocket).**
- **When a dead cell revives by rule #4 , it will be given a color that is the average of its neighbours (that revive it).**

## TODO list
### Originally requested
- [x] The game should tick automatically at a predefined interval, at say, 1 step per second.
- [x] This server allows multiple clients to share the same, synchronized world view.
- [x] Each client is assigned a random color on initialization.
- [x] Creating a point on any grid will create a live cell on that grid with the client’s color. This change should be synchronized across all connected clients. (Using any mechanism to achieve this, such as polling, comet or WebSocket).
- [x] When a dead cell revives by rule #4 , it will be given a color that is the average of its neighbors (that revive it).
### Requirement enhancement
- [x]  _Give the creator of the Grid Cell to config the tick interval upon creation._
- [x]  _Implement some kind of users authentication._
- [ ]  _Implement some kind of storage for users data._
- [ ]  _Implement an acceptable Application Error handling mechanism Across the App._
- [ ]  _Implement an acceptable logging mechanism across the App._
- [x]  _Implement unit tests for Models._
- [ ]  _Implement unit test for WebSockets endpoints._
- [ ]  _Implement integration tests for the whole backend services._
- [ ]  _Get to a coverage of at least 70%._
- [ ]  _Add more automates from places like [Eric Weisstein's treasure trove](http://www.ericweisstein.com/encyclopedias/life/)__

## Architectural insight

## Build Setup

``` bash
# install dependencies
npm install

# serve at localhost:3000, opens port for debugging process.
npm run dev|

# serve at localhost:3000
npm run app

# run unit tests
npm run unit

# run coverage
npm coverage

# run all tests
npm test
```
