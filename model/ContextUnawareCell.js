class ContextUnawareCell {

    toJSONObject() {
        return {
            color: '#' + this.color,
            createdOn: this.createdOn.toISOString()
        }
    }

    constructor() {
        // The default color is black.
        this.createdOn = new Date()
        this.color = '000000'
    }
}
module.exports = ContextUnawareCell