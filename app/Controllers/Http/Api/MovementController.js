'use strict'

/** @typedef {import('../../../../@types/Movement.d').IMovement} IMovement*/

/** @type {typeof import("../../../Models/Movement")} */
const MovementModel = use("App/Models/Movement")
/** @type {typeof import("../../../Models/Commission")} */
const CommissionModel = use("App/Models/Commission")
const UserModel = use("App/Models/User")
const Database = use('Database')

/** @type {import("../../../../@types/Acl/AclProvider").AclProvider} */
const AclProvider = use('AclProvider')

const MovementTypes = require("../../../../enums/MovementTypes")
const UserRoles = require('../../../../enums/UserRoles')
const MovementErrorException = require('../../../Exceptions/MovementErrorException')
const MovementError = require("../../../Exceptions/MovementErrorException")
const AclGenericException = require("../../../Exceptions/Acl/AclGenericException")

const {parse: parseCsv} = require("csv")
const {readFileSync} = require("fs")
const {Types: MongoTypes} = require("mongoose")
const moment = require("moment")

const {MovementsPermissions} = require("../../../Helpers/Acl/enums/movements.permissions");

/** @type {typeof import("../../../Exceptions/ImportException")} */
const ImportException = use("App/Exceptions/ImportException")

class MovementController {
  async read({auth, params}) {
    const userRole = +auth.user.role
    const forId = params["id"]
    let userId = auth.user._id

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) && forId) {
      userId = forId
    }

    return await MovementModel.getAll(userId)
  }

  async add({request, response}) {
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

  async cancel({request, params, response}) {
    const reason = request.input("reason")
    const movementId = params["id"]

    /**
     * @type {IMovement}
     */
    const movementRef = await MovementModel.find(movementId)

    if (!movementRef) {
      throw new MovementError("Movement not found.")
    }

    const movementCancelRef = await MovementModel.where({cancelRef: movementRef._id}).first()

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
  async currentStatus({params, auth}) {
    let userId = auth.user._id
    let userRole = +auth.user.role

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole)) {
      userId = params["id"]
    }

    /** @type {IMovement} */
    const result = await MovementModel.getLast(userId)
    const currMonthCommissions = await CommissionModel._getLastCommission(userId)

    if (!result) {
      throw new MovementErrorException("No movement found for the current user.")
    }

    return {
      deposit: result.deposit,
      interestAmount: result.interestAmount,
      interestPercentage: result.interestPercentage,
      currMonthCommissions: currMonthCommissions ? currMonthCommissions.currMonthCommissions : 0
    }
  }

  /**
   *
   * @param {{
   *  request: typeof import("@adonisjs/framework/src/Request")
   *  response: import("../../../../@types/HttpResponse").AdonisHttpResponse
   * }} param0
   */
  async import({request, auth, response}) {
    if (!auth.user || ![UserRoles.SERV_CLIENTI, UserRoles.ADMIN].includes(+auth.user.role)) {
      return response.unauthorized()
    }

    /** @type {import("@adonisjs/bodyparser/src/Multipart/File.js")} */
    const file = request.file("fileToImport")
    const userId = request.input("userId")

    if (!file || file.extname !== "csv") {
      throw new ImportException("The provided file must be a .csv")
    }

    const fileContent = readFileSync(file.tmpPath, "utf8")
    const csvData = await this._parseCsvFile(fileContent)

    if (userId.toString() !== csvData.userId.toString()) {
      throw new ImportException("The content of the file refers to another user.")
    }

    /** @type {import("../../../../@types/User.d").User} */
    const user = await UserModel.find(csvData.userId)

    if (!user) {
      throw new ImportException("Can't find any user with the specified id.")
    }

    if (![UserRoles.AGENTE, UserRoles.CLIENTE].includes(+user.role)) {
      throw new ImportException("User is not Agente or Cliente.")
    }

    // Controlla che non ci siano altri movimenti esistenti.
    const existingMovements = await MovementModel.getAll(csvData.userId)

    if (existingMovements.rows.length > 0) {
      throw new ImportException("User has already registered movements, so the new ones can't be imported.")
    }

    // Controlla che il movimento iniziale impostato per l'utente corrisponda con quello dell'importazione.
    if (+user.contractInitialInvestment !== +csvData.initialInvestment) {
      throw new ImportException("Users contract initial investment doesn't match with the one you're trying to import.")
    }

    // Controlla che l'interesse specificato per l'tente corrisponda con quello del file di importazione
    if (+user.contractPercentage !== +csvData.interestPercentage) {
      throw new ImportException("Users contract percentage doesn't match with the one you're trying to import.")
    }

    const db = await Database.connect('mongodb')

    // I'm using mongoose insert many instead of lucidMongo createMany because
    // the creation must not trigger the model's hooks.
    const insertResult = await db.collection("movements").insertMany(csvData.movementsList)

    return insertResult.ops
  }

  async getList({params, auth}) {
    let user = auth.user
    const userRole = user.role
    let userId = params.id || user._id.toString()
    let hasSubAgents = false

    // If is required data for a different user than the logged one
    // Must check permissions
    if (userId !== user._id.toString()) {
      if (!(await AclProvider.checkPermissions([MovementsPermissions.ACL_MOVEMENTS_ALL_READ, MovementsPermissions.ACL_MOVEMENTS_TEAM_READ], auth))) {
        throw new AclGenericException("Not enough permissions", AclGenericException.statusCodes.FORBIDDEN)
      }

      user = await UserModel.find(userId)
    }

    return await MovementModel.getAll(user._id)
  }

  /**
   * Cast a string to a valid number
   *
   * @param {string} rawValue
   */
  _castToNumber(rawValue) {
    const valueRegEx = new RegExp("[^0-9,]", "g")

    let value = (rawValue || "").replace(valueRegEx, "")

    return +value.replace(",", ".")
  }

  /**
   * From a row object, get the interests column and extracts the percentage
   *
   * @param {{}} rawObj
   */
  _parseInterestPercentage(rawObj) {
    const colKey = Object.keys(rawObj).find(_key => _key.startsWith("Int. Maturato"))

    if (!colKey) {
      throw new ImportException("Can't find column \"Int. Maturato\"")
    }

    return +colKey.replace(/[^0-9]/g, "")
  }

  /**
   * Parse the content of the css file and return ad array of movements.
   *
   * @param {string} rawFileContent
   * @returns {Promise<{
   *  userId: string
   *  interestPercentage: number
   *  initialInvestment: number
   *  movementsList: {}[]
   * }>}
   */
  async _parseCsvFile(rawFileContent) {
    if (!rawFileContent) {
      throw new ImportException("Empty CSV file.")
    }

    const delimiter = rawFileContent.match(/[;,]/)[0]
    const userIdString = rawFileContent.slice(0, rawFileContent.indexOf(delimiter)).trim()
    const userId = new MongoTypes.ObjectId(userIdString)
    const fileContent = rawFileContent.slice(rawFileContent.indexOf("\n"))

    /** @type {parseCsv.Options} */
    const options = {
      columns: true,
      delimiter
    }

    return new Promise((resolve, reject) => {
      parseCsv(fileContent, options, async (err, result) => {
        if (err || (err && err.length > 0)) {
          reject(err)
        } else {
          moment.locale("it")

          const totalsRowIndex = result.findIndex(_row => _row["Anno"].toString() === "Totale")

          // extract the last row that represents the totals row
          const totalsRow = result.slice(totalsRowIndex, totalsRowIndex + 1)

          result = result.slice(0, totalsRowIndex)

          // the file may contain future data, so i must exclude them and return only the valid data.
          const maxYear = moment().year()
          const maxMonth = moment().date() > 15 ? moment().month() : moment().subtract(1, "month").month()
          const dataToReturn = []
          const interestPercentage = this._parseInterestPercentage(result[0])
          let lastYear = 0
          let correctLastYear = 0

          for (const _entry of result) {
            if (_entry["Anno"]) {
              lastYear = +_entry["Anno"]
              correctLastYear = +_entry["Anno"]
            }

            const currDate = moment().month(_entry["Mese"].toLowerCase()).year(correctLastYear).subtract(1, "month")
            const currMonth = currDate.month()

            if (currDate.year() !== lastYear) {
              lastYear = currDate.year()
            }

            let capitaleVersato = this._castToNumber(_entry["Capitale Versato"])
            let capitalePrelevato = this._castToNumber(_entry["Cap. Prelevato"])
            let nuovoCapitale = this._castToNumber(_entry["Nuovo Cap. Affidato"])
            let interestsCollected = this._castToNumber(_entry['Int. Riscosso'])

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

            // create the recapitalization movement
            const recapitalization = {
              userId,
              movementType: !capitaleVersato ? MovementTypes.INITIAL_DEPOSIT : MovementTypes.INTEREST_RECAPITALIZED,
              amountChange: !capitaleVersato ? nuovoCapitale : this._castToNumber(_entry["Int. Ricapitalizzato"]),
              interestPercentage,
              depositOld: dataToReturn.length > 1 ? dataToReturn[dataToReturn.length - 1].deposit : 0,
              interestAmountOld: dataToReturn.length > 1 ? dataToReturn[dataToReturn.length - 1].interestAmount : 0,
              deposit: !capitaleVersato ? nuovoCapitale : capitaleVersato,
              interestAmount: this._castToNumber(_entry[`Int. Maturato ${interestPercentage}%`]),
              created_at: moment(`${lastYear}-${currMonth + 1}-16 00:00:00`, "YYYY-MM-DD HH:mm:ss").toDate(),
            }

            dataToReturn.push(recapitalization)

            if (recapitalization.movementType === MovementTypes.INITIAL_DEPOSIT) {
              console
            }

            // if there is already capitale and has been added new one, create a new deposit movement
            if (capitaleVersato && nuovoCapitale) {
              dataToReturn.push({
                userId,
                movementType: MovementTypes.DEPOSIT_ADDED,
                amountChange: nuovoCapitale,
                interestPercentage,
                depositOld: recapitalization.deposit,
                interestAmountOld: recapitalization.interestAmount,
                deposit: nuovoCapitale + capitaleVersato,
                interestAmount: recapitalization.interestAmount,
                created_at: moment(`${lastYear}-${currMonth + 1}-16 00:10:00`, "YYYY-MM-DD HH:mm:ss").toDate(),
              })
            }

            // if there is some capitale prelevato, creates a DEPOSIT_COLLECTED movement
            if (capitalePrelevato) {
              dataToReturn.push({
                userId,
                movementType: MovementTypes.DEPOSIT_COLLECTED,
                amountChange: capitalePrelevato,
                interestPercentage,
                depositOld: dataToReturn[dataToReturn.length - 1].deposit,
                interestAmountOld: dataToReturn[dataToReturn.length - 1].interestAmount,
                deposit: dataToReturn[dataToReturn.length - 1].deposit - capitalePrelevato,
                interestAmount: dataToReturn[dataToReturn.length - 1].interestAmount,
                created_at: moment(`${lastYear}-${currMonth + 1}-16 00:15:00`, "YYYY-MM-DD HH:mm:ss").toDate(),
              })
            }

            // if there is some collected interests, create a INTEREST_COLLECTED movement
            if (interestsCollected) {
              dataToReturn.push({
                userId,
                movementType: MovementTypes.INTEREST_COLLECTED,
                amountChange: interestsCollected,
                interestPercentage,
                depositOld: dataToReturn[dataToReturn.length - 1].deposit,
                interestAmountOld: dataToReturn[dataToReturn.length - 1].interestAmount,
                deposit: dataToReturn[dataToReturn.length - 1].deposit,
                interestAmount: dataToReturn[dataToReturn.length - 1].interestAmount - interestsCollected,
                created_at: moment(`${lastYear}-${currMonth + 1}-16 00:20:00`, "YYYY-MM-DD HH:mm:ss").toDate(),
              })
            }
          }

          await this._matchCsvTotals(dataToReturn, totalsRow)

          resolve({
            userId,
            interestPercentage,
            initialInvestment: dataToReturn[0].amountChange,
            movementsList: dataToReturn
          })
        }
      })
    })
  }

  /**
   * Checks if the totals written in the file matches the totals calculated on the generated movements list.
   *
   * @param {{}[]} movementsList
   * @param {{}} totalsRow
   */
  async _matchCsvTotals(movementsList, totalsRow) {
    const errors = []
    const totalAddedDeposit = this._castToNumber(totalsRow["Nuovo Cap. Affidato"])
    const totalCollectedInterest = this._castToNumber(totalsRow["Int. Riscosso"])
    const totalCollectedDeposit = this._castToNumber(totalsRow["Cap. Prelevato"])

    let movementsAddedDeposit = 0
    let movementsCollectedDeposit = 0
    let movementsCollectedInterest = 0

    for (const movement of movementsList) {
      switch (movement.movementType) {
        case MovementTypes.INITIAL_DEPOSIT:
          movementsAddedDeposit += movement.amountChange
          break;
        // case MovementTypes.INTEREST_RECAPITALIZED:
        //   break;
        case MovementTypes.INTEREST_COLLECTED:
          movementsCollectedInterest += movement.amountChange
          break;
        case MovementTypes.DEPOSIT_ADDED:
          movementsAddedDeposit += movement.amountChange
          break;
        case MovementTypes.DEPOSIT_COLLECTED:
          movementsCollectedDeposit += movement.amountChange
          break;
      }
    }

    if (movementsAddedDeposit !== totalAddedDeposit) {
      errors.push(`Added deposit doesn't match. Expected: ${totalAddedDeposit}, Found: ${movementsAddedDeposit}`)
    }

    if (movementsCollectedDeposit !== totalCollectedDeposit) {
      errors.push(`Collected deposit doesn't match. Expected: ${totalCollectedDeposit}, Found: ${totalCollectedDeposit}`)
    }

    if (movementsCollectedInterest !== totalCollectedInterest) {
      errors.push(`Collected interest doesn't match. Expected: ${totalCollectedInterest}, Found: ${movementsCollectedInterest}`)
    }

    if (errors.length > 0) {
      new ImportException(errors.join(";\n "))
    }
  }
}

module.exports = MovementController
