'use strict'

/** @typedef {import('../../@types/SecretKey').SecretKey} SecretKey */

/** @type {typeof import('lucid-mongo/src/LucidMongo/Model')} */
const Model = use('Model')

const AclGenericException = use("App/Exceptions/Acl/AclGenericException")

class SecretKey extends Model {
  static get connection() {
    return 'mongoIAM'
  }
  
  static get collection() {
    return 'apps'
  }
  
  /**
   * Given the public key of a client, return its private key, stored in the DB.
   *
   * @param {string} key
   * @return {Promise<any>}
   */
  static async getClientConfig(key) {
    const client = await this.query()
      .where({"secrets.client.publicKey": key, "secrets.client.type": "client"})
      .first();
    
    if (!client) {
      throw new AclGenericException("Invalid client key");
    }
    
    return client;
  }
  
  static async getClientKey(key){
    const client = await this.getClientConfig(key);
  
    return client.secrets.client.secretKey;
  }
  
  static async getClientApp(key) {
    const client = await this.getClientConfig(key);
    
    return client.code;
  }
}

module.exports = SecretKey
