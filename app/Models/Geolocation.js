'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {typeof import('lucid-mongo/src/Database')} */
const Database = use("Database")

class Geolocation extends Model {
  static db = null

  static get connection() {
    return 'mongoGeolocation'
  }

  static async boot() {
    super.boot()

    this.db = Database.connection(this.connection)
  }

  /**
   * @return {Promise<import("../../@types/Geolocation/ItaProvince").ItaProvince[]>}
   */
  static async getItaProvinces() {
    return this.db.collection("itaProvinces").find()
  }

  /**
   * @return {Promise<import("../../@types/Geolocation/ItaRegion").ItaRegion[]>}
   */
  static async getItaRegions() {
    return this.db.collection("itaRegions").find()
  }

  /**
   * @return {Promise<import("../../@types/Geolocation/ItaComuni").ItaComuni[]>}
   */
  static async getItaComunis() {
    return this.db.collection("itaComunis").find()
  }

  /**
   * @return {Promise<import("../../@types/Geolocation/Country").Country[]>}
   */
  static async getCountries(query = {}, projection = null) {
    const aggregation = [
      {"$match": query || {}}
    ]

    if (projection) {
      aggregation.push({
        "$project": projection
      })
    }

    const collection = await this.db.getCollection("countries")

    return collection.aggregate(aggregation).toArray()
  }

}

module.exports = Geolocation
