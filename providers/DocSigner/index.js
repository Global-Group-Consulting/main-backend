const {ApiClient, DocumentsApi, TemplatesApi, SignrequestQuickCreateApi, Signer} = require('signrequest-client');
const {SignRequestQuickCreate} = require('signrequest-client');
const {template: _template, snakeCase} = require("lodash")

const Env = use("Env")

/** @typedef {import("../../@types/User.d").User} IUser */
/** @typedef {import("../../@types/SignRequest/index.d").Signer} ISigner */

/** @typedef {import("../../@types/SignRequest/index.d").SignRequestQuickCreate} ISignRequestQuickCreate */
/** @typedef {import("../../@types/SignRequest/Config.d").TemplateConfig} ITemplateConfig */

class DocSigner {
  constructor(Config) {
    /**
     * @type {import("../../@types/SignRequest/index.d").Config}
     */
    this._config = Config.get("docSigner")

    // Configure API key authorization: Token
    const Token = ApiClient.instance.authentications["Token"];
    Token.apiKey = this._config.apiKey
    Token.apiKeyPrefix = "Token"

    this.DocumentsApi = new DocumentsApi();
    this.TemplatesApi = new TemplatesApi();
    this.SignrequestQuickCreateApi = new SignrequestQuickCreateApi();
  }

  async _call(section, method, data) {
    return new Promise((resolve, reject) => {
      section[method](data, (error, data, response) => {
        if (error) {
          if (error && error.response && error.response.text) {
            error.message = error.response.text
          }

          reject(error);
        } else {
          resolve(data);
        }
      })
    })
  }

  /**
   * @param {IUser} data
   * @return {ISigner[]}
   * @private
   */
  _prepareSigners(data) {
    if (!data.mobile) {
      throw new Error("Missing user mobile phone. Is required for user authentication when signing.")
    }

    const toReturn = []
    const userPhone = !data.mobile.toString().startsWith("+") ? "+39" + data.phone : data.phone

    /** @type {Signer} */
    const firstSigner = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      verify_phone_number: Env.get("NODE_ENV") === "development" ? "" : userPhone,
      language: data.language || "it",
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
  _prepareTagsData(data, template) {
    const toReturn = []

    for (const field of template.fields) {
      const valueTmpl = field.text
      const newValue = (_template(valueTmpl))(data)

      if (newValue) {
        toReturn.push({
          ...field,
          text: newValue
        })
      }
    }

    return toReturn
  }

  async getTemplates() {
    return this._call(this.TemplatesApi, "templatesList")
  }

  async getDocuments() {
    return this._call(this.DocumentsApi, "documentsList")
  }

  async deleteDocument(uuid) {
    return this._call(this.DocumentsApi, "documentsDelete", uuid)
  }

  /**
   *
   * @param {ITemplateConfig} templateConfig
   * @param {IUser} incomingData
   * @return {Promise<unknown>}
   */
  async sendSignRequest(templateConfig, incomingData) {

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
    const signRequestResult = SignRequestQuickCreate.constructFromObject(signRequestData);

    return this._call(this.SignrequestQuickCreateApi, "signrequestQuickCreateCreate", signRequestResult)
  }
}

module.exports = DocSigner
