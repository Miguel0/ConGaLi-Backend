class TemplateGroup {
  constructor () {
    this.createdOn = new Date()
    this.name = ''
    this.templates = []
  }

  asJSONObject () {
    let json = {}

    json.name = this.name
    json.templates = this.templates

    return json
  }
}
module.exports = TemplateGroup
