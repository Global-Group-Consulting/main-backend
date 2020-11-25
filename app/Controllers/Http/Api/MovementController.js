'use strict'

/** @typedef {import('../../../../@types/Movement.d').IMovement} IMovement*/

const MovementModel = use("App/Models/Movement")
const UserModel = use("App/Models/User")
const MovementTypes = require("../../../../enums/MovementTypes")
const UserRoles = require('../../../../enums/UserRoles')
const MovementErrorException = require('../../../Exceptions/MovementErrorException')
const MovementError = require("../../../Exceptions/MovementErrorException")

const { parse: parseCsv } = require("csv")
const { readFileSync } = require("fs")
const { Types: MongoTypes } = require("mongoose")
const moment = require("moment")

class MovementController {

  async read({ auth, params }) {
    const userRole = +auth.user.role
    const forId = params["id"]
    let userId = auth.user.id

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) && forId) {
      userId = forId
    }

    return await MovementModel.getAll(userId)
  }

  async add({ request, response }) {
    /**
     * @type {import("../../../../@types/Movement.d").AddMovementDto}
     */
    const data = request.all()

    if ([MovementTypes.CANCEL_INTEREST_COLLECTED,
    MovementTypes.CANCEL_DEPOSIT_COLLECTED,
    MovementTypes.CANCEL_COMMISSION_COLLECTED].includes(+data.movementType)) {
      throw new MovementErrorException("Can't add this type of movement.")
    }

    const user = await UserModel.find(data.userId)

    const newMovement = await MovementModel.create({
      ...data,
      interestPercentage: +user.contractPercentage
    })

    return newMovement
  }

  async cancel({ request, params, response }) {
    const reason = request.input("reason")
    const movementId = params["id"]

    /**
     * @type {IMovement}
     */
    const movementRef = await MovementModel.find(movementId)

    if (!movementRef) {
      throw new MovementError("Movement not found.")
    }

    const movementCancelRef = await MovementModel.where({ cancelRef: movementRef._id }).first()

    if (movementCancelRef) {
      throw new MovementError("Movement already canceled.")
    }

    const movementType = MovementTypes.get(movementRef.movementType).cancel
    const jsonData = movementRef.toJSON()

    if (!movementType) {
      throw new MovementError("Can't cancel this type of movement.")
    }
    const user = await UserModel.find(data.userId)


    delete jsonData._id

    const newMovement = await MovementModel.create({
      ...jsonData,
      movementType,
      depositOld: jsonData.deposit,
      cancelRef: movementId,
      cancelReason: reason,
      interestPercentage: +user.contractPercentage
    })

    return newMovement
  }

  /**
   * 
   * @param {{auth: {user: {id: string}}}} param0 
   * @returns {{deposit:number, interestAmount:number, interestPercentage:number}}
   */
  async currentStatus({ params, auth }) {
    let userId = auth.user.id
    let userRole = +auth.user.role

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole)) {
      userId = params["id"]
    }

    /** @type {IMovement} */
    const result = await MovementModel.getLast(userId)

    if (!result) {
      throw new MovementErrorException("No movement found for the current user.")
    }

    return {
      deposit: result.deposit,
      interestAmount: result.interestAmount,
      interestPercentage: result.interestPercentage
    }
  }

  /**
   * 
   * @param {{
   *  request: typeof import("@adonisjs/framework/src/Request")
   *  response: import("../../../../@types/HttpResponse").AdonisHttpResponse
   * }} param0 
   */
  async import({ request, auth, response }) {
    if (!auth.user || !auth.user.superAdmin) {
      response.unauthorized()
    }

    /** @type {import("@adonisjs/bodyparser/src/Multipart/File.js")} */
    const file = request.file("fileToImport")

    if (!file || file.extname !== "csv") {
      response.expectationFailed("The provided file must be a .csv")
    }

    const fileContent = readFileSync(file.tmpPath, "utf-8")
    const csvData = this._parseCsvFile(fileContent)

    return csvData
  }

  _castToNumber(rawValue) {
    const valueRegEx = new RegExp("[^0-9,]", "g")

    let value = (rawValue || "").replace(valueRegEx, "")

    return +value.replace(",", ".")
  }

  _parseInterestPercentage(rawObj) {
    const colKey = Object.keys(rawObj).find(_key => _key.startsWith("Int. Maturato"))

    if (!colKey) {
      throw new Error("Can't find column \"Int. Maturato\"")
    }

    return +colKey.replace(/[^0-9]/g, "")
  }

  _parseCsvFile(rawFileContent) {
    const delimiter = ","
    const userId = new MongoTypes.ObjectId(rawFileContent.slice(0, rawFileContent.indexOf(",")))
    const fileContent = rawFileContent.slice(rawFileContent.indexOf("\n"))

    /** @type {parseCsv.Options} */
    const options = {
      columns: true,
      delimiter
    }

    return new Promise((resolve, reject) => {
      parseCsv(fileContent, options, (err, result) => {
        if (err || (err && err.length > 0)) {
          reject(err)
        } else {
          moment.locale("it")

          // the file may contain future data, so i must exclude them and return only the valid data.
          const maxYear = moment().year()
          const maxMonth = moment().date() > 15 ? moment().month() : moment().subtract(1, "month").month()
          const dataToReturn = []
          const interestPercentage = this._parseInterestPercentage(result[0])
          let lastYear = 0

          for (const _entry of result) {
            const currMonth = moment().month(_entry["Mese"].toLowerCase()).month()

            let capitaleVersato = this._castToNumber(_entry["Capitale Versato"])
            let nuovoCapitale = this._castToNumber(_entry["Nuovo Cap. Affidato"])

            if (_entry["Anno"]) {
              lastYear = +_entry["Anno"]
            }

            // If there is no deposit or new Depoit, skip the row
            if (!capitaleVersato && !nuovoCapitale) {
              continue
            }

            // If the lastYear is greater then the currentYear or
            // the year is the same as the current and the month is greater than the maxMonth,
            // breaks the cycle because the other data are useless because refers to future dates.
            if (lastYear > maxYear || (lastYear === maxYear && currMonth > maxMonth)) {
              break
            }

            //TODO:: Manca da aggiungere i movimenti relativi ai prelievi e ai depositi.

            dataToReturn.push({
              userId,
              movementType: 1,
              amountChange: this._castToNumber(_entry["Int. Ricapitalizzato"]),
              interestPercentage,
              depositOld: dataToReturn.length > 1 ? dataToReturn[dataToReturn.length - 1].deposit : 0,
              interestAmountOld: dataToReturn.length > 1 ? dataToReturn[dataToReturn.length - 1].interestAmount : 0,
              deposit: !capitaleVersato ? nuovoCapitale : capitaleVersato,
              interestAmount: this._castToNumber(_entry[`Int. Maturato ${interestPercentage}%`]),
              created_at: moment(`${lastYear}-${currMonth + 1}-16 00:00:00`, "YYYY-MM-DD HH:mm:ss").toISOString(),
            })
          }

          resolve({
            userId,
            data: dataToReturn
          })
        }
      })
    })
  }
}

module.exports = MovementController
