'use strict'

const { ValidationException } = require('@adonisjs/validator/src/Exceptions/index.js')

class IntlValidationException extends ValidationException {
  
  async handle ({ messages }, { request, response, session, antl }) {
    console.log("request language", request.language(), antl.currentLocale())
    
    for (const msg of messages) {
      const validationKey = `validations.${msg.field}.${msg.validation}`
    
      // first check if there is a custom message for this field
      if (antl.get(validationKey)) {
        // replace the message with the custom one
        msg.message = antl.formatMessage(validationKey)
      }
    }
    
    return super.handle({ messages }, { request, response, session })
  }
}

module.exports = IntlValidationException
