class CellsTemplateDefinition {
  constructor () {
    this.createdOn = new Date()
    this.name = ''
    this.imgSrc = ''
    this.attribution = ''
    this.points = []
    this.details = null
  }

  toJSONObject () {
    let json = {}

    json.name = this.name
    json.imgSrc = this.imgSrc
    json.attribution = this.attribution
    json.points = this.points.slice(0)

    if (this.details) {
      json.details = this.details
    }

    return json
  }
}
module.exports = CellsTemplateDefinition
