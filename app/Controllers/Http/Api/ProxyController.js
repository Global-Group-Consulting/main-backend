'use strict'

const http = require("http")
const https = require("https")
const axios = require("axios")
const httpProxy = require('http-proxy');
const ProxyException = use("App/Exceptions/ProxyException");
const Env = use("Env")

class ProxyController {
  proxy;

  constructor() {
    this.proxy = httpProxy.createProxyServer({})

  }

  /**
   *
   * @param {String} url
   * @param {Request} req
   * @param {User} user
   * @param {'club'} prefix
   * @private
   */
  async _forward(url, req, user, prefix) {
    const parsedUrl = new URL(url)
    const headers = req.headers();

    headers.host = parsedUrl.host;
    headers.accept = "application/json"

    let result;

    try {
      const reqBody = req.all()

      result = await axios.request({
        url: url + req.url().replace("/api/external" + prefix, ""),
        method: req.method(),
        headers: headers,
        data: {
          ...reqBody,
          _client_secret: reqBody.key,
          _server_secret: Env.get("SERVER_KEY"),
          _auth_user: user
        }
      })

      return result.data
    } catch (er) {
      throw new ProxyException(er)
    }
  }

  async club({request, auth}) {
    const baseUrl = Env.get("CLUB_SERVER")

    return await this._forward(baseUrl, request, auth.user, "/club")
  }
}

module.exports = ProxyController
