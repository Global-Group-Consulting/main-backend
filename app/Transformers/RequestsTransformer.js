'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

const UserTransformer = use("App/Transformers/UserTransformer")

/**
 * RequestsTransformer class
 *
 * @class RequestsTransformer
 * @constructor
 */
class RequestsTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return [
      'user'
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

    delete data.user
    delete data._id

    return data
  }

  includeUser(req, {transform}) {
    return transform.include("referenceAgentData").item(req.user, UserTransformer)
  }
}

module.exports = RequestsTransformer
