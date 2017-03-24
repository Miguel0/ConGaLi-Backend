class ContextUnawareCell {
  constructor () {
    // The default color is black.
    this.createdOn = new Date()
    this.color = '000000'
  }

  toJSONObject () {
    return {
      color: '#' + this.color,
      createdOn: this.createdOn.toISOString()
    }
  }
}
module.exports = ContextUnawareCell
