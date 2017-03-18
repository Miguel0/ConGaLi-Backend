function ContextUnawareCell() {
    // The default color is black.
    this.createdOn = new Date()
    this.color = '000000'
}

ContextUnawareCell.prototype.toJSONObject = function () {
    return {
        color: '#' + this.color,
        createdOn: this.createdOn.toISOString()
    }
}
module.exports = ContextUnawareCell