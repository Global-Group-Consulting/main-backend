'use strict'

const axios = require("axios")
const SecretKey = use("App/Models/SecretKey")
const ProxyException = use("App/Exceptions/ProxyException");
const Env = use("Env")

class ProxyController {
  /**
   * @param {String} url
   * @param {Request} req
   * @param {User} user
   * @param {'club'} prefix
   * @private
   */
  async _forward(url, req, user, path) {
    const parsedUrl = new URL(url)
    /**
     * @type {{host: string, accept: string, "client-key": string}}
     */
    const headers = req.headers();

    headers.host = parsedUrl.host;
    headers.accept = "application/json"

    let result;

    try {
      const reqBody = req.all()

      result = await axios.request({
        url: url + path,
        method: req.method(),
        headers: headers,
        data: {
          ...reqBody,
          _client_secret: await SecretKey.getClientKey(headers["client-key"]),
          _server_secret: Env.get("SERVER_KEY"),
          _auth_user: user
        }
      })

      return result.data
    } catch (er) {
      throw new ProxyException(er)
    }
  }

  async club(request, auth, path) {
    const baseUrl = Env.get("CLUB_SERVER")

    return await this._forward(baseUrl, request, auth.user, path)
  }

  async handle({request, auth}) {
    const url = request.url().replace("/api/ext/", "");
    const destination = url.split("/");

    switch (destination[0]) {
      case "club":
        return this.club(request, auth, url.slice(url.indexOf("/")))
    }

  }
}

module.exports = ProxyController
