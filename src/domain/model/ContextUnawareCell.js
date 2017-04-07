class ContextUnawareCell {
  constructor (owner) {
    this.createdOn = new Date()
    this.owner = owner
    this.color = null
  }

  toJSONObject () {
    return {
      color: '#' + (this.color || this.owner.color),
      createdOn: this.createdOn.toISOString()
    }
  }
}
module.exports = ContextUnawareCell
