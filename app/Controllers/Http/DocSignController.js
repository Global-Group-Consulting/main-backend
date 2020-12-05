'use strict'

/** @type {typeof import("../../../providers/DocSignerProvider")} */
const DocSigner = use("DocSigner")
const Config = use("Config")

class DocSignController {

  async readTemplates() {
    return DocSigner.getTemplates()
  }

  async readDocuments() {
    return DocSigner.getDocuments()
  }

  async deleteDocument({params}) {
    const uuid = params.uuid

    return DocSigner.deleteDocument(uuid)
  }

  async sendDocument() {
    /** @type {import("../../../@types/SignRequest/Config.d").Config} */
    const docsConfig = Config.get("docSigner")

    /** @type {import("../../../@types/User.d").User} */
    const incomingData = {
      firstName: "Giuseppe",
      lastName: "verdi",
      email: "florian.leica@develon.com",
      phone: "3202942127",
      contractNumber: "001576"
    }

    return DocSigner.sendSignRequest(docsConfig.templates.mainContract, incomingData)
  }
}

module.exports = DocSignController
