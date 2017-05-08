[![Github Releases](https://img.shields.io/github/downloads/atom/atom/latest/total.svg?style=flat-square)](../..)

# ConGali WebSocket Backend

##  &nbsp;<img src="../../wiki/images/idea.png" alt="Overview" width="22px"> Overview

ConGaLi is an implementation of Conway's Game of Life [Conway’s Game of Life] is a famous simulation that demonstrates cellular automaton.

### &nbsp;<img src="../../wiki/images/warning.png" alt="Disclaimer" width="20px"> **Disclaimer!!!!!!**

ConGaLi is still in a proof of concept stage, so we don't advice it usage for other reasons than satisfy your own curiosity right now nor we will take any responsibility in any security risk you could be exposed. Nonetheless, we are working to get the architecture ready and deployed for be at alpha stage. For more information on this you can take a look at the [roadmap][Roadmap] wiki page, and also it will be useful to take a peek at the [todo list][TODO].

This particular implementation is only the backend for the WebSocket servers that will allow the game to run on it's initial stage (once the system begun to be distributed it will take a group of services to do that).

It begun as a project that I had to present as a code challenge, but I've decided to include it as part of my portfolio. We will make it scale as much as we can and we hope more people will unite and we will design a really interesting and solid system that we can be proud of.

##  &nbsp;<img src="../../wiki/images/law.png" alt="Basic Rules" width="22px"> Basic Rules

This game is modeled as a grid with 4 simple rules:

1. **Any live cell with fewer than two live neighbours dies, as if caused by under-population.**
2. **Any live cell with two or three live neighbours lives on to the next generation.**
3. **Any live cell with more than three live neighbours dies, as if by overcrowding.**
4. **Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.**

This particular implementation creates a Multiplayer app version of Game of Life, with the following instructions as a foundational stone and premises (which are relevant the backend services):

- **The game should tick automatically at a predefined interval, at say, 1 step per second.**
- **This server allows multiple clients to share the same, synchronized world view.**
- **Each client is assigned a random color on initialization.**
- **Creating a point on any grid will create a live cell on that grid with the client’s color. This change should be synchronized across all connected clients. (Using any mechanism to achieve this, such as polling, comet or WebSocket).**
- **When a dead cell revives by rule #4 , it will be given a color that is the average of its neighbours (that revive it).**

##  &nbsp;<img src="../../wiki/images/todo_list.png" alt="TODO" width="22px"> TODO list

There are lots of improvements and goals to take into account to  build the overall system, and that data will be addressed on our wiki, of course. If interested on reviewing that, just check our [TODO] and [Roadmap] wiki page.

**To find out more, please check out the [Website] and the [Wiki].**

##  &nbsp;<img src="../../wiki/images/training.png" alt="ConGaLi 101" width="22px"> ConGaLi technology 101

The repository structure follows the conceptual architecture of ConGaLi, which consists of loosely-coupled sub-systems connected:

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
[Setup Guide]: ./wiki/Setting-up-ConGaLi
[Technical Architecture Overview]: ./wiki/Technical-Architecture-Overview
[Technical Documentation]: ./wiki/ConGaLi-Technical-documentation
[Roadmap]: ./wiki/Product-roadmap
[TODO]: ./wiki/TODO

[Conway’s Game of Life]: https://en.wikipedia.org/wiki/Conway's_Game_of_Life
[Eric Weisstein's treasure trove]: http://www.ericweisstein.com/encyclopedias/life/
[install Git]: https://git-scm.com/downloads
[install Docker]: https://docs.docker.com/engine/installation/

[techdocs-image]: ../../wiki/images/knowledge_sharing.png
[setup-image]: ../../wiki/images/support.png
[roadmap-image]: ../../wiki/images/adventure_map.png
[contributing-image]: ../../wiki/images/helping_hand.png

***
Icon pack by <a href="https://icons8.com" alt="Icons8"><img src="https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/wiki/images/Icons8.png" width="20px"></a>
