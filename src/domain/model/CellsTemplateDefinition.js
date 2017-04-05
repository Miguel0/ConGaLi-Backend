class CellsTemplateDefinition {
  constructor () {
    this.createdOn = new Date()
    this.name = ''
    this.imgSrc = ''
    this.attribution = ''
    this.points = []
  }

  asJSONObject () {
    let json = {}

    json.name = this.name
    json.imgSrc = this.imgSrc
    json.attribution = this.attribution
    json.points = this.points

    if (this.details) {
      json.details = this.details
    }

    return json
  }
}
module.exports = CellsTemplateDefinition
