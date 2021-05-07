'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * UserTransformer class
 *
 * @class UserTransformer
 * @constructor
 */
class UserTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return [
      'referenceAgentData'
    ]
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    const data = {
      // add your transformation object here
      ...model,
      id: model._id.toString(),
    }

    delete data.referenceAgentData
    delete data._id

    return data
  }

  includeReferenceAgentData(req) {
    if(!req.referenceAgentData){
      return
    }

    return this.item(req.referenceAgentData, UserTransformer)
  }
}

module.exports = UserTransformer
