# Conway's Game Backend

[Conway’s Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) is a famous simulation that demonstrates cellular automaton. It is modeled as a grid with 4 simple rules:

1. **Any live cell with fewer than two live neighbours dies, as if caused by under-population.**
2. **Any live cell with two or three live neighbours lives on to the next generation.**
3. **Any live cell with more than three live neighbours dies, as if by overcrowding.**
4. **Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.**

This particular implementation creates a Multiplayer Web app version of Game of Life, with the following instructions as a foundational stone and premises (wich are relevant to backend services):

- **The game should tick automatically at a predefined interval, at say, 1 step per second.**
- **This server allows multiple clients to share the same, synchronized world view.**
- **Each client is assigned a random color on initialization.**
- **Creating a point on any grid will create a live cell on that grid with the client’s color. This change should be synchronized across all connected clients. (You can use any mechanism to achieve this, such as polling, comet or WebSocket).**
- **When a dead cell revives by rule #4 , it will be given a color that is the average of its neighbours (that revive it).**
- **\(Frontend Request) Include a toolbar that places some predefined patterns at random places with the player’s color, such as those found at [here](https://en.wikipedia.org/wiki/Conway’s_Game_of_Life#Examples_of_patterns) (not necessary to implement all, just 3 - 4 is fine).**

## TODO list
- [x] **\(Originally requested) _The game should tick automatically at a predefined interval, at say, 1 step per second._**
- [ ] **\(Originally requested) _This server allows multiple clients to share the same, synchronized world view._**
- [x] **\(Originally requested) _Each client is assigned a random color on initialization._**
- [ ] **\(Originally requested) _Creating a point on any grid will create a live cell on that grid with the client’s color. This change should be synchronized across all connected clients. (You can use any mechanism to achieve this, such as polling, comet or WebSocket)._**
- [ ] **\(Originally requested) _When a dead cell revives by rule #4 , it will be given a color that is the average of its neighbours (that revive it)._**
- [x] **\(Requirement enhancement)** Give the creator of the Grid Cell to config the tick interval upon creation.
- [ ] **\(Requirement enhancement)** Implement some kind of users authentication.
- [ ] **\(Requirement enhancement)** Implement some kind of storage for users data.
- [ ] **\(Requirement enhancement)** Implement an acceptable Application Error handling mechanism Across the App.
- [ ] **\(Requirement enhancement)** Implement an acceptable logging mechanism across the App.
- [ ] **\(Requirement enhancement)** Implement test for Models.
- [ ] **\(Requirement enhancement)** Implement test for WebSockets endpoints.
- [ ] **\(Requirement enhancement)** Get to a coverage of at least 70%.

## Installation

```
npm install
```

## Usage

``` Run
npm run app
```

``` Test
npm test
```

``` Coverage
npm coverage
```
