const { IntlValidator } = require('./IntlValidator')

class WhitelistValidator extends IntlValidator {
  get includeParams () {
    return false;
  }

  get includeFiles () {
    return false;
  }

  get data () {
    const data = this.ctx.request.only(Object.keys(this.rules));
    const files = this.ctx.request.files();

    // I remove all unspecified fields
    this.ctx.request.body = data;

    if (this.includeParams) {
      return Object.assign({}, data, this.ctx.request.params);
    }

    if (this.includeFiles) {
      return Object.assign({}, data, files);
    }

    return data;
  }
}

exports.WhitelistValidator = WhitelistValidator
