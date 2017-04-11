class TemplateGroup {
  constructor () {
    this.createdOn = new Date()
    this.name = ''
    this.templates = []
  }

  toJSONObject () {
    let json = {}

    json.name = this.name
    json.templates = this.templates.map(template => template.toJSONObject())

    return json
  }
}
module.exports = TemplateGroup
