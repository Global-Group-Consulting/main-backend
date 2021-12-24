'use strict'

/** @typedef {import('../../@types/SecretKey').SecretKey} SecretKey */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AclGenericException = use("App/Exceptions/Acl/AclGenericException")

class SecretKey extends Model {
  /**
   * Given the public key of a client, return its private key, stored in the DB.
   *
   * @param {string} key
   * @return {Promise<boolean>}
   */
  static async getClientKey(key) {
    if (process.env.NODE_ENV === "development") {
      return "dev_key";
    }

    const client = await this.query()
      .where({ publicKey: key, type: "client" })
      .first();

    if (!client) {
      throw new AclGenericException("Invalid client key");
    }

    return client.secretKey;
  }

}

module.exports = SecretKey
