const util = require('lucid-mongo/lib/util')
const { AggregationCursor } = require('mongodb')
const { preparePaginatedResult } = require('../app/Utilities/Pagination')
const { AggregationBuilder } = require('./AggregationBuilder')

/** @type {typeof import('lucid-mongo/src/LucidMongo/Model')} */
const Model = use('Model')

/** @type {import('lucid-mongo/src/Database')} */
const Database = use('Database')

module.exports = class MongoModel extends Model {
  static db
  
  /**
   * @return {Promise<Database>}
   */
  static async getConnection () {
    
    if (!this.db) {
      this.db = await Database.connect('mongodb')
    }
    
    return this.db
  }
  
  /**
   *
   * @param {any[] | AggregationBuilder} pipeline
   * @param {null | string} [collection]
   * @return {Promise<{
   *
   * }[]>}
   */
  static async aggregateRaw (pipeline, collection = null) {
    let aggregation
    
    if (pipeline instanceof AggregationBuilder) {
      aggregation = pipeline
    } else {
      aggregation = await this.createAggregation(collection)
      aggregation.setRawPipeline(pipeline)
    }
    
    return aggregation.execute()
  }
  
  /**
   *
   * @param {string | null} collection
   * @return {Promise<AggregationBuilder>}
   */
  static async createAggregation (collection = null) {
    const connection = await this.getConnection()
    
    return new AggregationBuilder(connection, collection || this.collection)
  }
}
