/**
 * ContextUnawareCell is a Class that represents a cell that's "live", and stores
 * the reference to the user that created the cell (although automatically
 * generated cells doesn't have this attribute setted).
 *
 * On top of that, it stores the color for automatically generated cells, but in
 * case of being user interaction generated cells, the color is retrieved from
 * the user configuration.
 */

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
