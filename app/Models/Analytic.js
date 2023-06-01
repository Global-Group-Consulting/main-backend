const MongoModel = require('../../classes/MongoModel')

class Analytic extends MongoModel {
  
  
  user () {
    return this.belongsTo('App/Models/User', '_id', '_id')
      .select(['_id', 'firstName', 'lastName', 'email', 'referenceAgentData', 'role', 'roles'])
  }
}

module.exports = Analytic
