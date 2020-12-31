'use strict'
/** @type {typeof import("../../../providers/DocSigner")} */
const DocSigner = use("DocSigner")
const Config = use("Config")

/** @type {import("../../../Models/Request")} */
const RequestModel = use("App/Models/Request")
const Helpers = use("Helpers")

const UserRoles = require("../../../../enums/UserRoles")
const RequestTypes = require("../../../../enums/RequestTypes")
const pdfFiller = require('pdffiller');
const path = require("path")
const {
  formatDate,
  formatMoney,
  formatWrittenNumbers,
  formatContractNumber,
  formatResidencePlace,
  formatBirthPlace
} = require("../../../Helpers/ModelFormatters")

class DocController {

  async getReceiptDeposit({request, auth, response}) {
    const requestId = request.input("id")
    const reqData = await RequestModel.find(requestId)

    if (!reqData) {
      throw new Error("No request found")
    }

    if (reqData.userId.toString() !== auth.user._id.toString()
      && ![UserRoles.SERV_CLIENTI, UserRoles.ADMIN].includes(auth.user.role)) {
      throw new Error("You don't have the permissions to read this file.")
    }

    if (reqData.type !== RequestTypes.VERSAMENTO) {
      throw new Error("Request is not of type DEPOSIT.")
    }

    const user = await reqData.user().fetch()
    const reqNumber = formatContractNumber(user.contractNumber) + "_" + formatDate(reqData.created_at, true, "DD/MM/YY")
      .replace(/[\/:]/g, "")
      .replace(/ /g, "_")
    const docData = {
      contract_number: formatContractNumber(user.contractNumber),
      full_name: user.firstName + " " + user.lastName,
      birth_place: formatBirthPlace(user),
      birth_date: formatDate(user.birthDate),
      residence_place: formatResidencePlace(user),
      req_number: reqNumber,
      amount: formatMoney(reqData.amount),
      amount_text: formatWrittenNumbers(reqData.amount),
      created_at: formatDate(reqData.created_at)
    }
    const fileName = "receipt_deposit_" + reqData._id.toString()
    const filePath = Helpers.tmpPath() + "/" + fileName
    const doc = await this.fillPdf("resources/fileTemplates/receipts_deposit_euro.pdf", filePath, docData)

    response.header('x-file-name', `Integrazione ${reqNumber}.pdf`)

    return response.download(filePath)
  }

  async fillPdf(src, dest, data) {
    return new Promise((resolve, reject) => {
      pdfFiller.fillFormWithFlatten(src, dest, data, true, function (err) {
        if (err) {
          return reject(err)
        }

        resolve(this)
      })
    })
  }
}

module.exports = DocController
