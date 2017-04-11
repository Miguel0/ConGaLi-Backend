class ContextUnawareCell {
  constructor (owner) {
    this.createdOn = new Date()
    this.owner = owner
    this.color = null
  }

  getColor () {
    return this.color || this.owner.color
  }

  toJSONObject () {
    return {
      color: `#${this.getColor()}`,
      createdOn: this.createdOn.toISOString()
    }
  }
}
module.exports = ContextUnawareCell
