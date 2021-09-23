module.exports = function (Route) {
  Route.group(() => {
    Route.get('/ita/regions', 'GeolocationController.getItaRegions')
    Route.get('/ita/provinces', 'GeolocationController.getItaProvinces')
    Route.get('/ita/comunis', 'GeolocationController.getItaComunis')
    Route.get('/countries', 'GeolocationController.getCountries')

  }).prefix('/api/geo')
}
