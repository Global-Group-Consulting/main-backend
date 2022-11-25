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
   * @param {any[]} pipeline
   * @param {string} [collection]
   * @return {Promise<any[]>}
   */
  static async aggregateRaw (pipeline, collection = null) {
    const connection = await this.getConnection()
    
    return await connection.collection(collection || this.collection).aggregate(pipeline).toArray()
  }
  
}
