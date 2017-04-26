[![Github Releases](https://img.shields.io/github/downloads/atom/atom/latest/total.svg?style=flat-square)](../..)

# ConGali Backend

ConGaLi is an implementation of Conway's Game of Life [Conway’s Game of Life] is a famous simulation that demonstrates cellular automaton.

This particular implementation is only the backend for the WebSocket servers that will allow the game to run on it's initial stage (once the system begun to be distributed it will take a group of services to do that).

It is modeled as a grid with 4 simple rules:

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


##  &nbsp;<img src="../../wiki/images/todo_list.png" alt="TODO" width="22px"> TODO list

This are the things next on our TODO list:

- [x]  _Give the creator of the Grid Cell to config the tick interval upon creation._
- [x]  _Implement some kind of rudimentary users authentication._
- [ ]  _Implement some kind of storage for users data._
- [ ]  _Implement an acceptable Application Error handling mechanism Across the App._
- [ ]  _Implement an acceptable logging mechanism across the App._
- [x]  _Implement unit tests for Models._
- [ ]  _Implement unit test for WebSockets endpoints._
- [ ]  _Implement integration tests for the whole backend services._
- [ ]  _Get to a coverage of at least 70%._
- [ ]  _Add more automates taken from places like [Eric Weisstein's treasure trove]_

**To find out more, please check out the [Website] and the [Wiki].**

##  &nbsp;<img src="../../wiki/images/training.png" alt="ConGaLi 101" width="22px"> ConGaLi technology 101

The repository structure follows the conceptual architecture of ConGaLi, which consists of loosely-coupled sub-systems connected:

![architecture-image]

To briefly explain these sub-systems:
* **UI Web servers** This will serve all the specific implementation for interacting with this backend.
* **WebSocket backend** This will serve al the actual services that will execute the game's logic. Although, this will change in a not so distant future.

**For more information on the current ConGaLi Architecture, please see the [Technical Architecture Overview]**.

## &nbsp;<img src="../../wiki/images/running_rabbit.png" alt="Quickstart" width="22px"> Quickstart

You have to **[install Git]** and **[install Docker]** if you haven't already:

Follow the steps wrote here: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

##  &nbsp;<img src="../../wiki/images/search.png" alt="Find out more" width="22px"> Find out more

| **[Technical Documentation]**     | **[Setup Guide]**     | **[Roadmap]**           | **[Contributing]**           |
|-------------------------------------|-------------------------------|-----------------------------------|---------------------------------------------|
| ![techdocs-image] | ![setup-image] | ![roadmap-image] | ![contributing-image] |

##  &nbsp;<img src="../../wiki/images/help.png" alt="Questions, help?" width="22px"> Questions or need help?

Check out the **[Talk to us]** page on our wiki.


[release-image]: https://img.shields.io/github/downloads/atom/atom/latest/total.svg?style=flat-square
[releases]: ./releases

[Website]: -
[Wiki]: ./wiki
[Talk to us]: ./wiki/Talk-to-us
[Contributing]: ./wiki/Contributing
[Setup Guide]: ./Setting-up-ConGaLi
[Technical Architecture Overview]: ./wiki//Technical-Architecture-Overview
[Technical Documentation]: ./wiki/ConGaLi-Technical-documentation
[Roadmap]: ./wiki/Product-roadmap

[Conway’s Game of Life]: https://en.wikipedia.org/wiki/Conway's_Game_of_Life
[Eric Weisstein's treasure trove]: http://www.ericweisstein.com/encyclopedias/life/
[install Git]: https://git-scm.com/downloads
[install Docker]: https://docs.docker.com/engine/installation/

[techdocs-image]: ../../wiki/images/knowledge_sharing.png
[setup-image]: ../../wiki/images/support.png
[roadmap-image]: ../../wiki/images/adventure_map.png
[contributing-image]: ../../wiki/images/helping_hand.png

***
<a href="https://icons8.com">Icon pack by Icons8</a>
