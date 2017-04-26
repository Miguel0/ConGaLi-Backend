[![Github Releases](https://img.shields.io/github/downloads/atom/atom/latest/total.svg?style=flat-square)](https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket)

# ConGali Backend

ConGaLi is an implementation of Conway's Game of Life [Conway’s Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) is a famous simulation that demonstrates cellular automaton.

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

## TODO list

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
- [ ]  _Add more automates taken from places like [Eric Weisstein's treasure trove](http://www.ericweisstein.com/encyclopedias/life/)_

**To find out more, please check out the [ConGaLi website] [website] and the [ConGaLi wiki] [wiki].**

## ConGaLi technology 101

The repository structure follows the conceptual architecture of ConGaLi, which consists of loosely-coupled sub-systems connected:

![architecture] [architecture-image]

To briefly explain these sub-systems:
* **UI Web servers** This will serve all the specific implementation for interacting with this backend.
* **WebSocket backend** This will serve al the actual services that will execute the game's logic. Although, this will change in a not so distant future.

**For more information on the current ConGaLi Architecture, please see the [Technical Architecture Overview] [architecture-doc]**.

## Quickstart

Assuming git and **[Docker] [docker-install]** installed:

See https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

## Find out more

| **[Technical Docs] [techdocs]**     | **[Setup Guide] [setup]**     | **[Roadmap] [roadmap]**           | **[Contributing] [contributing]**           |
|-------------------------------------|-------------------------------|-----------------------------------|---------------------------------------------|
| [![i1] [techdocs-image]] [techdocs] | [![i2] [setup-image]] [setup] | [![i3] [roadmap-image]] [roadmap] | [![i4] [contributing-image]] [contributing] |

## Contributing

We're committed to a loosely-coupled architecture for ConGaLi and would love to get your contributions within each of the six sub-systems.

If you would like help implementing a new feature, check out our **[Contributing] [contributing]** page on the wiki!

## Questions or need help?

Check out the **[Talk to us] [talk-to-us]** page on our wiki.

## Copyright and license

ConGaLi is copyright 2017-2017 ConGaLi Ltd.

Licensed under the **[MIT] [license]** (the "License");
you may not use this software except in compliance with the License.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[release-image]: https://img.shields.io/github/downloads/atom/atom/latest/total.svg?style=flat-square
[releases]: https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/releases

[license-image]: http://img.shields.io/badge/license-Apache--2-blue.svg?style=flat
[license]: http://www.apache.org/licenses/LICENSE-2.0

[website]: -
[wiki]: https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/wiki
[talk-to-us]: https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/wiki/Talk-to-us
[contributing]: https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/wiki/Contributing
[setup]: https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/wiki/Setting-up-ConGaLi
[techdocs]: https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/wiki/ConGaLi-technical-documentation
[roadmap]: https://github.com/miguel-isasmendi/ConGaLi-Backend-WebSocket/wiki/Product-roadmap

[techdocs-image]: https://d3i6fms1cm1j0i.cloudfront.net/github/images/techdocs.png
[setup-image]: https://d3i6fms1cm1j0i.cloudfront.net/github/images/setup.png
[roadmap-image]: https://d3i6fms1cm1j0i.cloudfront.net/github/images/roadmap.png
[contributing-image]: https://d3i6fms1cm1j0i.cloudfront.net/github/images/contributing.png

