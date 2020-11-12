'use strict'

/** @typedef {import("../../../@types/Request").Request} RequestModel} */

class requestsUpdate {
  get data() {
    const data = this.ctx.request.only(Object.keys(this.rules))

    // I remove all unspecified fields
    this.ctx.request.body = data

    return data
  }
  /** 
   * @returns {RequestModel} 
   */
  get rules() {
    return {
      amount: "required",
      contractNumber: "required",
      type: "required",
    }
  }

}

module.exports = requestsUpdate
