'use strict'

const IntlValidator = require('../IntlValidator')

class authAuthLogin extends IntlValidator {
  /**
   * Return true if you want to validate all fields instead of only the first error
   *
   * @return {boolean}
   */
  get validateAll () {
    return true
  }
  
  get rules () {
    return {
      email: 'required|email',
      password: 'required '
    }
  }
}

module.exports = authAuthLogin
