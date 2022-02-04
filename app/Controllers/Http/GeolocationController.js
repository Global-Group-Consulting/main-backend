'use strict'

/** @type {typeof import('../../Models/Geolocation')} */
const Geolocation = use("App/Models/Geolocation")

/** @type {typeof import('../../../providers/Addresses')} */
const AddressesProvider = use("AddressesProvider")

class GeolocationController {
  async getItaRegions() {
    return Geolocation.getItaRegions()
  }
  
  async getItaProvinces({request}) {
    return Geolocation.getItaProvinces(request.input("region"))
  }
  
  async getItaComunis({request}) {
    return Geolocation.getItaComunis(request.qs)
  }
  
  async getCountries() {
    return Geolocation.getCountries({}, {
      cca2: 1,
      callingCodes: 1,
      name: 1,
      translations: 1,
      languages: 1
    })
  }
}

module.exports = GeolocationController
