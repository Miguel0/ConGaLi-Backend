const TemplateGroup = require('../domain/model/TemplateGroup')
const CellsTemplateDefinition = require('../domain/model/CellsTemplateDefinition')

let cellsTemplates = []

let templateGroup = new TemplateGroup()
templateGroup.name = 'Still lifes'

let template = new CellsTemplateDefinition()
template.name = 'Block'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/9/96/Game_of_life_block_with_border.svg'
template.attribution = 'By None (Own work) [Public domain], via Wikimedia Commons'
template.points = [
  {x: 0, y: 0}, {x: 1, y: 0},
  {x: 0, y: 1}, {x: 1, y: 1}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Beehive'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/6/67/Game_of_life_beehive.svg'
template.attribution = 'By None (Own work) [Public domain], via Wikimedia Commons'
template.points = [
  {x: 1, y: 0}, {x: 2, y: 0},
  {x: 0, y: 1}, {x: 3, y: 1},
  {x: 1, y: 2}, {x: 2, y: 2}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Loaf'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Game_of_life_loaf.svg'
template.attribution = 'By None (Own work) [Public domain], via Wikimedia Commons'
template.points = [
  {x: 1, y: 0}, {x: 2, y: 0},
  {x: 0, y: 1}, {x: 3, y: 1},
  {x: 1, y: 2}, {x: 3, y: 2},
  {x: 2, y: 3}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Boat'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Game_of_life_boat.svg'
template.attribution = 'By Bryan.burgers (Own work) [Public domain], via Wikimedia Commons'
template.points = [
  {x: 0, y: 0}, {x: 1, y: 0},
  {x: 0, y: 1}, {x: 2, y: 1},
  {x: 1, y: 2}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Flower'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/3/31/Game_of_life_flower.svg'
template.attribution = 'By Harsh Srivastava (Own work) [CC BY-SA 4.0 (http://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons'
template.points = [
  {x: 1, y: 0},
  {x: 0, y: 1}, {x: 2, y: 1},
  {x: 1, y: 2}
]

templateGroup.templates.push(template)

cellsTemplates.push(templateGroup)

templateGroup = new TemplateGroup()
templateGroup.name = 'Oscillators'

template = new CellsTemplateDefinition()
template.name = 'Blinker'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/9/95/Game_of_life_blinker.gif'
template.details = '(period 2)'
template.attribution = 'By JokeySmurf at en.wikipedia [Public domain], via Wikimedia Commons'
template.points = [
  {x: 1, y: 0},
  {x: 1, y: 1},
  {x: 1, y: 2}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Toad'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/1/12/Game_of_life_toad.gif'
template.details = '(period 2)'
template.attribution = 'By JokeySmurf [Public domain], via Wikimedia Commons'
template.points = [
  {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
  {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Beacon'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Game_of_life_beacon.gif'
template.details = '(period 2)'
template.attribution = 'By JokeySmurf at en.wikipedia [Public domain], via Wikimedia Commons'
template.points = [
  {x: 0, y: 0}, {x: 1, y: 0},
  {x: 0, y: 1},
  {x: 3, y: 2},
  {x: 2, y: 3}, {x: 3, y: 3}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Pulsar'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/0/07/Game_of_life_pulsar.gif'
template.details = '(period 3)'
template.attribution = 'By JokeySmurf at en.wikipedia [Public domain], via Wikimedia Commons'
template.points = [
  {x: 4, y: 0}, {x: 10, y: 0},
  {x: 4, y: 1}, {x: 10, y: 1},
  {x: 4, y: 2}, {x: 5, y: 2}, {x: 9, y: 2}, {x: 10, y: 2},
  {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 5, y: 4}, {x: 6, y: 4}, {x: 8, y: 4}, {x: 9, y: 4}, {x: 12, y: 4}, {x: 13, y: 4}, {x: 14, y: 4},
  {x: 2, y: 5}, {x: 4, y: 5}, {x: 6, y: 5}, {x: 8, y: 5}, {x: 10, y: 5}, {x: 12, y: 5}, {x: 8, y: 5},
  {x: 4, y: 6}, {x: 5, y: 6}, {x: 9, y: 6}, {x: 10, y: 6},
  {x: 4, y: 8}, {x: 5, y: 8}, {x: 9, y: 8}, {x: 10, y: 8},
  {x: 2, y: 9}, {x: 4, y: 9}, {x: 6, y: 9}, {x: 8, y: 9}, {x: 10, y: 9}, {x: 12, y: 9}, {x: 8, y: 9},
  {x: 0, y: 10}, {x: 1, y: 10}, {x: 2, y: 10}, {x: 5, y: 10}, {x: 6, y: 10}, {x: 8, y: 10}, {x: 9, y: 10}, {x: 12, y: 10}, {x: 13, y: 10}, {x: 14, y: 10},
  {x: 4, y: 12}, {x: 5, y: 12}, {x: 9, y: 12}, {x: 10, y: 12},
  {x: 4, y: 13}, {x: 10, y: 13},
  {x: 4, y: 14}, {x: 10, y: 14}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Pentadecathlon'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/f/fb/I-Column.gif'
template.details = '(period 15)'
template.attribution = 'Unknown'
template.points = [
  {x: 1, y: 0},
  {x: 1, y: 1},
  {x: 0, y: 2}, {x: 2, y: 2},
  {x: 1, y: 3},
  {x: 1, y: 4},
  {x: 1, y: 5},
  {x: 1, y: 6},
  {x: 0, y: 7}, {x: 2, y: 7},
  {x: 1, y: 8},
  {x: 1, y: 9}
]

templateGroup.templates.push(template)

cellsTemplates.push(templateGroup)

templateGroup = new TemplateGroup()
templateGroup.name = 'Spaceships'

template = new CellsTemplateDefinition()
template.name = 'Glider'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Game_of_life_animated_glider.gif'
template.details = 'it moves by the cells grid'
template.attribution = 'Unknown'
template.points = [
  {x: 1, y: 0},
  {x: 2, y: 1},
  {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}
]

templateGroup.templates.push(template)

template = new CellsTemplateDefinition()
template.name = 'Lightweight spaceship (LWSS)'
template.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/3/37/Game_of_life_animated_LWSS.gif'
template.details = 'it moves by the cells grid'
template.attribution = 'Unknown'
template.points = [
  {x: 0, y: 0}, {x: 3, y: 0},
  {x: 4, y: 1},
  {x: 0, y: 2}, {x: 4, y: 2},
  {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}
]

templateGroup.templates.push(template)

cellsTemplates.push(templateGroup)

module.exports = cellsTemplates
