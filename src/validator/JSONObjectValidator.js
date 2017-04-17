/**
Schema example:

{
  $strict: true,
  stringAttribute: {
    $optional: false,
    $exceptionMessage: stringOrFunction
    $exceptionBuilder: function,
    $type: 'string',
    $childsDef: {
      ...
    },
    $maxLength: {
      $value: numberOrFunction,
      $exceptionMessage: stringOrFunction
      $exceptionBuilder: function
    },
    $minLength: {
      $value: numberOrFunction,
      $exceptionMessage: stringOrFunction
      $exceptionBuilder: function
    },
    $in: {
      $value: arrayOrFunction,
      $exceptionMessage: stringOrFunction
      $exceptionBuilder: function
    },
    $contains: {
      $value: objectOrFunctionOrRegex,
      $exceptionMessage: stringOrFunction
      $exceptionBuilder: function
    }
  }
}
*/
class JSONObjectValidator {
  constructor (options, objectToValidate, validationSchema) {
    this.objectToValidate = objectToValidate || null
    this.validationSchema = validationSchema || null
    this.initOptions(options)
  }

  initOptions (options) {
    this.options = options || this.options || { throwsException: true, customAttributesPrefix: '$', defaultExceptionMessage: 'ValidationError!!!' }
    this.options.exceptionBuilder = this.buildExceptionFor
  }

  buildExceptionFor () {

  }

  validate () {
    try {
      this.doValidateSchema(this.validationSchema)

      if (!this.objectToValidate) {
        throw new Error('Should have objectToValidate')
      }

      this.initOptions()

      this.doValidate(this.objectToValidate, this.validationSchema, {actualPath: ''})
    } catch (e) {
      this.exceptionBuilder.apply(this, e)
    }
  }

  doValidateSchema (schema) {
    // TODO validate schema in depth
    if (!schema) {
      throw new Error('Should have validationSchema')
    }
    return true
  }

  checkType (objectToValidate, schemaDefinedType) {
  }

  doValidate (objectToValidate, validationSchema, genericArguments) {
    // TODO check if the object has optional attributes

    if (!objectToValidate && !validationSchema.optional) {
      throw {
        'message': validationSchema[`${this.options.customAttributesPrefix}exceptionMessage`],
        'validatedObject': objectToValidate,
        'validatedSchema': validationSchema,
        'genericArguments': genericArguments
      }
    }

    let actualPath = genericArguments.actualPath
    let schemaDefinedType = validationSchema[`${this.options.customAttributesPrefix}type`]

    this.checkType(objectToValidate, schemaDefinedType)

    // Starting child validation

    if (schemaDefinedType === 'array' || schemaDefinedType === Array) {
      let childsDef = validationSchema[`${this.options.customAttributesPrefix}childsDef`]

      for (let j = 0; j < objectToValidate.length; j++) {
        genericArguments.actualPath = `${actualPath}.${j}`

        this.doValidate(objectToValidate[j], childsDef, genericArguments)
      }
    } else {
      let domainAttributeKeys = Object.keys(validationSchema).filter(key => key.indexOf(this.options.customAttributesPrefix) !== 0)

      for (let j = 0; j < domainAttributeKeys.length; j++) {
        let domainAttributeKey = domainAttributeKeys[j]
        let objectValue = objectToValidate[domainAttributeKey]

        genericArguments.actualPath = `${actualPath}.${domainAttributeKey}`
        this.doValidate(objectValue, validationSchema[domainAttributeKey], genericArguments)
      }
    }
  }
}

module.exports = JSONObjectValidator
