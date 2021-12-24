'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class NewsStatus extends Model {
  static get createdAtColumn () {
    return 'createdAt';
  }

  static get updatedAtColumn () {
    return 'updatedAt';
  }

  news () {
    return this.belongsTo('App/Models/News', "newsId", "_id");
  }
}

module.exports = NewsStatus;
