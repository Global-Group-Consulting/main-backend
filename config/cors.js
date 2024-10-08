'use strict'

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Origin
  |--------------------------------------------------------------------------
  |
  | Set a list of origins to be allowed. The value can be one of the following
  |
  | Boolean: true - Allow current request origin
  | Boolean: false - Disallow all
  | String - Comma seperated list of allowed origins
  | Array - An array of allowed origins
  | String: * - A wildcard to allow current request origin
  | Function - Receives the current origin and should return one of the above values.
  |
  */
  // origin: process.env.NODE_ENV === "development" || ["https://staging-club-backend.herokuapp.com", "capacitor://localhost", "http://localhost", "http://dev.globalclub.consulting"],
  origin: (origin) => {
    if (process.env.NODE_ENV !== "production") {
      return true;
    }

    const validOrigins = [
      "https://staging-club-backend.herokuapp.com",
      "https://private.globalclub.it",
      "http://local.private.globalclub.it",
      "http://local.private.globalgroup.consulting",
      "https://api.globalclub.it",
      "https://api.stg.globalclub.it",
      "https://api2.stg.globalclub.it",
      "https://api2.globalclub.it",
      // capacitor IOS
      "capacitor://localhost",
      // capacitor android
      "http://localhost"];

    let toReturn = validOrigins.includes(origin);

    if (!toReturn) {
      const devHostName = "dev.globalclub.consulting";
      const url = new URL(origin);
      toReturn = url.hostname === devHostName;
    }

    return toReturn;
  },

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  |
  | HTTP methods to be allowed. The value can be one of the following
  |
  | String - Comma seperated list of allowed methods
  | Array - An array of allowed methods
  |
  */
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],

  /*
  |--------------------------------------------------------------------------
  | Headers
  |--------------------------------------------------------------------------
  |
  | List of headers to be allowed via Access-Control-Request-Headers header.
  | The value can be on of the following.
  |
  | Boolean: true - Allow current request headers
  | Boolean: false - Disallow all
  | String - Comma seperated list of allowed headers
  | Array - An array of allowed headers
  | String: * - A wildcard to allow current request headers
  | Function - Receives the current header and should return one of the above values.
  |
  */
  headers: true,

  /*
  |--------------------------------------------------------------------------
  | Expose Headers
  |--------------------------------------------------------------------------
  |
  | A list of headers to be exposed via `Access-Control-Expose-Headers`
  | header. The value can be on of the following.
  |
  | Boolean: false - Disallow all
  | String: Comma seperated list of allowed headers
  | Array - An array of allowed headers
  |
  */
  exposeHeaders: false,

  /*
  |--------------------------------------------------------------------------
  | Credentials
  |--------------------------------------------------------------------------
  |
  | Define Access-Control-Allow-Credentials header. It should always be a
  | boolean.
  |
  */
  credentials: true,

  /*
  |--------------------------------------------------------------------------
  | MaxAge
  |--------------------------------------------------------------------------
  |
  | Define Access-Control-Allow-Max-Age
  |
  */
  maxAge: 90
}
