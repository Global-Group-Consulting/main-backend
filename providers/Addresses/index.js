/**
 * @typedef {{alpha2Code: string, name: string,translations: {[string]: string}[], nativeName: string,callingCodes: string[] }} Country
 */

/**
 * @typedef {{nome: string, codice: string, sigla: string, regione: string}} Province
 */

const COUNTRIES_API_URL = "https://restcountries.eu/rest/v2/all"
const REGIONS_API_URL = "https://comuni-ita.herokuapp.com/api/regioni"
const PROVINCES_API_URL = "https://comuni-ita.herokuapp.com/api/province"

const axios = require('axios')

class Addresses {
  constructor(config) {
    this.config = config

    /**
     * @type {Country[]}
     */
    this.countriesList = null

    /**
     *
     * @type {string[]}
     */
    this.regionsList = null

    /**
     * @type {Province[]}
     */
    this.provincesList = null
  }

  async fetchCountriesList() {
    const resp = await axios.get(COUNTRIES_API_URL + "?fields=alpha2Code;name;translations;nativeName;callingCodes;")

    this.countriesList = resp.data
  }

  async fetchRegionsList() {
    const resp = await axios.get(REGIONS_API_URL)

    this.regionsList = resp.data
  }

  async fetchProvincesList() {
    const resp = await axios.get(PROVINCES_API_URL)

    this.provincesList = resp.data
  }

  /**
   * @param {string} countryCode
   * @returns {Promise<Country>}
   */
  async getCountry(countryCode) {
    if (!this.countriesList) {
      await this.fetchCountriesList()
    }

    return this.countriesList.find(el => (el.alpha2Code || "").toLowerCase() === countryCode || (el.name || "").toLowerCase() === countryCode)
  }

  /**
   * @param {string} provinceCode
   * @returns {Promise<Province>}
   */
  async getProvince(provinceCode) {
    if (!this.provincesList) {
      await this.fetchProvincesList()
    }

    return this.provincesList.find(el => el.sigla.toLowerCase() === provinceCode)
  }

  /**
   * @param {string} regionCode
   * @returns {Promise<string>}
   */
  async getRegion(regionCode) {
    if (!this.regionsList) {
      await this.fetchRegionsList()
    }

    return this.regionsList.find(el => el === regionCode)
  }
}

module.exports = Addresses;
