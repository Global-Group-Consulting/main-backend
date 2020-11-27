class WhitelistValidator {
  get includeParams() {
    return false
  }

  get data() {
    const data = this.ctx.request.only(Object.keys(this.rules))

    // I remove all unspecified fields
    this.ctx.request.body = data

    if (this.includeParams) {
      return Object.assign({}, data, this.ctx.request.params)
    }

    return data
  }
}

exports.WhitelistValidator = WhitelistValidator