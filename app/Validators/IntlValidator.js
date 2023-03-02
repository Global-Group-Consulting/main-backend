const IntlValidationException = require('../../app/Exceptions/IntlValidationException')

class IntlValidator {
  fails (errorMessages) {
    throw IntlValidationException.validationFailed(errorMessages)
  }
}

module.exports = IntlValidator
