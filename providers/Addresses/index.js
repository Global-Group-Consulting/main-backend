/**
 * @typedef {import("../../@types/Geolocation/Country").Country} Country
 */

/**
 * @typedef {import("../../@types/Geolocation/ItaRegion").ItaRegion} Region
 */

/**
 * @typedef {import("../../@types/Geolocation/ItaProvince").ItaProvince} Province
 */

const axios = require('axios')

/** @type {typeof import('../../app/Models/Geolocation')} */
const Geolocation = use("App/Models/Geolocation")

class Addresses {
  constructor(config) {
    this.config = config

    /**
     * @type {Country[]}
     */
    this.countriesList = null

    /**
     *
     * @type {Region[]}
     */
    this.regionsList = null

    /**
     * @type {Province[]}
     */
    this.provincesList = null
  }

  async fetchCountriesList() {
    const resp = await Geolocation.getCountries()

    this.countriesList = resp
  }

  async fetchRegionsList() {
    const resp = await Geolocation.getItaRegions()

    this.regionsList = resp
  }

  async fetchProvincesList() {
    const resp = await Geolocation.getItaProvinces()

    this.provincesList = resp
  }

  /**
   * @param {string} countryCode
   * @returns {Promise<Country>}
   */
  async getCountry(countryCode) {
    if (!countryCode) {
      return
    }

    if (!this.countriesList) {
      await this.fetchCountriesList()
    }

    return this.countriesList.find(el => (el.cca2 || "").toLowerCase() === countryCode || (el.name.common || "").toLowerCase() === countryCode)
  }

  /**
   * @param {string} provinceCode
   * @returns {Promise<Province>}
   */
  async getProvince(provinceCode) {
    if (!provinceCode) {
      return
    }

    if (!this.provincesList) {
      await this.fetchProvincesList()
    }

    return this.provincesList.find(el => el.sigla.toLowerCase() === provinceCode.toLowerCase())
  }

  /**
   * @param {string} regionCode
   * @returns {Promise<Region>}
   */
  async getRegion(regionCode) {
    if (!regionCode) {
      return
    }

    if (!this.regionsList) {
      await this.fetchRegionsList()
    }

    return this.regionsList.find(el => el.nome.toLowerCase() === regionCode.toLowerCase())
  }
}

module.exports = Addresses;
