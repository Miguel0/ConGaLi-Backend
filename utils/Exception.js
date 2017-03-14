function Exception (titleKey, bodyKey, arguments) {
    this.titleKey = titleKey;
    this.bodyKey = bodyKey;
    this.arguments = arguments || {};
}

module.exports = Exception;