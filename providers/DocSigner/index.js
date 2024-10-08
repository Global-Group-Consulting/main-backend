const {
  ApiClient,
  DocumentsApi,
  TemplatesApi,
  SignrequestQuickCreateApi,
  Signer,
  SignrequestsApi
} = require('signrequest-client')
const { SignRequestQuickCreate } = require('signrequest-client')
const { template: _template, snakeCase } = require('lodash')

const Env = use('Env')

/** @typedef {import('../../@types/User.d').User} IUser */
/** @typedef {import('../../@types/SignRequest/index.d').Signer} ISigner */

/** @typedef {import('../../@types/SignRequest/index.d').SignRequestQuickCreate} ISignRequestQuickCreate */
/** @typedef {import('../../@types/SignRequest/Config.d').TemplateConfig} ITemplateConfig */

class DocSigner {
  constructor (Config) {
    /**
     * @type {import('../../@types/SignRequest/index.d').Config}
     */
    this._config = Config.get('docSigner')
    
    // Configure API key authorization: Token
    const Token = ApiClient.instance.authentications['Token']
    Token.apiKey = this._config.apiKey
    Token.apiKeyPrefix = 'Token'
    
    this.DocumentsApi = new DocumentsApi()
    this.TemplatesApi = new TemplatesApi()
    this.SignrequestsApi = new SignrequestsApi()
    this.SignrequestQuickCreateApi = new SignrequestQuickCreateApi()
  }
  
  async _call (section, method, data) {
    return new Promise((resolve, reject) => {
      section[method](data, (error, data, response) => {
        console.log('error', error)
        
        if (error) {
          if (error && error.response && error.response.text) {
            error.message = error.response.text
          }
          
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
  
  /**
   * @param {IUser} data
   * @return {ISigner[]}
   * @private
   */
  _prepareSigners (data) {
    if (!data.mobile) {
      throw new Error('Missing user mobile phone. Is required for user authentication when signing.')
    }
    
    const toReturn = []
    const userPhone = !data.mobile.toString().startsWith('+') ? '+39' + data.mobile : data.mobile
    
    /** @type {Signer} */
    const firstSigner = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      verify_phone_number: Env.get('NODE_ENV') === 'development' ? '' : userPhone,
      language: data.language || 'it'
      // after_document: "" // test what does it do.
    }
    
    toReturn.push(Signer.constructFromObject(firstSigner))
    
    return toReturn
  }
  
  /**
   * @param {{}} data
   * @param {ITemplateConfig} template
   * @return {ITemplateConfig[]}
   * @private
   */
  _prepareTagsData (data, template) {
    const toReturn = []
    
    for (const field of template.fields) {
      const valueTmpl = field.text
      let newValue
      
      try {
        newValue = (_template(valueTmpl))(data)
      } catch (er) {
        // ignore any error that comes from the template compilation
        newValue = ''
      }
      
      if (newValue) {
        toReturn.push({
          ...field,
          text: newValue
        })
      }
    }
    
    return toReturn
  }
  
  async getTemplates () {
    return this._call(this.TemplatesApi, 'templatesList')
  }

  async getDocuments() {
    return this._call(this.DocumentsApi, "documentsList")
  }
  
  async getDocument (uuid) {
    return this._call(this.DocumentsApi, 'documentsRead', uuid)
  }
  
  async deleteDocument (uuid) {
    return this._call(this.DocumentsApi, 'documentsDelete', uuid)
  }
  
  /**
   *
   * @param {ITemplateConfig} templateConfig
   * @param {IUser} incomingData
   * @param {string} existingRequest
   * @return {Promise<unknown>}
   */
  async sendSignRequest (templateConfig, incomingData, existingRequest) {
    
    // If already exists a sign request, first cancel it and the create the new one
    if (existingRequest) {
      try {
        /**
         * @type {{detail: "OK", cancelled: boolean}}
         */
        const result = await this._call(this.SignrequestsApi, 'signrequestsCancelSignrequest', existingRequest.uuid)
        
        /*if (!result.cancelled) {
          throw new Error("Can't cancel the current sign request.")
        }*/
      } catch (er) {
        throw er
      }
    }
    
    /** @type {ISignRequestQuickCreate} */
    const signRequestData = {
      ...this._config.signRequestData,
      /** @type {ISigner[]} */
      signers: this._prepareSigners(incomingData),
      template: this._config.publicUrl + `/templates/${templateConfig.uuid}/`,
      prefill_tags: this._prepareTagsData(incomingData, templateConfig),
      name: `contratto-ggc-${snakeCase(incomingData.firstName)}_${snakeCase(incomingData.lastName)}.pdf`,
      events_callback_url: this._config.signRequestData.events_callback_url + `?uid=${incomingData.id}`
      // message: "Messaggio del documento",
      // subject: "Richiesta di firma contratto per Mario Rossi",
    }
    /**
     * @type {ISignRequestQuickCreate}
     */
    const signRequestObj = SignRequestQuickCreate.constructFromObject(signRequestData)
    const result = await this._call(this.SignrequestQuickCreateApi, 'signrequestQuickCreateCreate', signRequestObj)

    result.sentRequest = signRequestObj
    
    return result
  }
}

/**
 *
 * @type {DocSigner}
 */
module.exports = DocSigner
