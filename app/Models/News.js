'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use('Database');

class News extends Model {
  static db = null;

  static get createdAtColumn () {
    return 'createdAt';
  }

  static get updatedAtColumn () {
    return 'updatedAt';
  }

  static async boot () {
    super.boot();

    this.db = await Database.connect("mongodb");
  }

  static async aggregate (aggregation) {
    return this.db.collection("news").aggregate(aggregation).toArray();
  }

  static async readUnreadOnes (userId) {
    return await this.aggregate([
      {
        '$lookup': {
          'from': 'news_statuses',
          'localField': '_id',
          'foreignField': 'newsId',
          'as': 'readings'
        }
      }, {
        '$match': {
          'readings.userId': {
            '$ne': userId
          }
        }
      }
    ]);
  }

  readings () {
    return this.hasMany('App/Models/NewsStatus', "_id", "newsId");
  }

}

module.exports = News;
