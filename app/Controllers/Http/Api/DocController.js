'use strict'

/** @type {typeof import("../../../providers/DocSigner")} */
const DocSigner = use("DocSigner")
const Config = use("Config")

/** @type {import("../../../Models/Request")} */
const RequestModel = use("App/Models/Request")
const Helpers = use("Helpers")

const UserRoles = require("../../../../enums/UserRoles")
const RequestTypes = require("../../../../enums/RequestTypes")
const CurrencyType = require("../../../../enums/CurrencyType");

const pdfFiller = require('pdffiller');
const ExcelJS = require('exceljs');
const path = require("path")
const moment = require("moment")

const {
  formatDate,
  formatMoney,
  formatWrittenNumbers,
  formatContractNumber,
  formatResidencePlace,
  formatBirthPlace
} = require("../../../Helpers/ModelFormatters")

class DocController {
  get pageSetup() {
    return {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      showGridLines: true,
      horizontalCentered: true,
      // verticalCentered: true
    }
  }

  async _fillPdf(src, dest, data) {
    return new Promise((resolve, reject) => {
      pdfFiller.fillFormWithFlatten(src, dest, data, true, function (err) {
        if (err) {
          return reject(err)
        }

        resolve(this)
      })
    })
  }

  _generateRiscossioniSheet(workbook, data) {
    const sheetRiscossioni = workbook.addWorksheet('Riscossioni Capitale - Provvigioni', {
      pageSetup: this.pageSetup,
    });

    const columnsStyle = {
      font: {size: 12},
    }

    const columns = [
      {
        header: 'Id Contratto', key: "contractNumber",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'center'},
        }),
        width: 15
      },
      {header: 'Nome Utente', key: "name", style: columnsStyle, width: 25},
      {
        header: 'Importo',
        key: "amount",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'right'},
          numFmt: '"€" #,##0.00'
        }),
        width: 18
      },
      {header: 'Tipo Richiesta', key: "type", style: columnsStyle, width: 20},
      {
        header: 'Data Richiesta', key: "created_at",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'center'},
          numFmt: "DD/MM/YYYY HH:mm:ss"
        }),
        width: 20
      },
      {
        header: 'Data Approvazione', key: "completed_at",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'center'},
          numFmt: "DD/MM/YYYY HH:mm:ss"
        }),
        width: 20
      },
    ]
    const rows = data.reduce((acc, row) => {
      acc.push({
        contractNumber: row.user.contractNumber,
        name: row.user.firstName + " " + row.user.lastName,
        amount: row.amount,
        type: RequestTypes.get(row.type).id,
        created_at: moment(row.created_at).toDate(),
        completed_at: moment(row.completed_at).toDate(),
      })

      return acc
    }, [])

    sheetRiscossioni.columns = columns;
    sheetRiscossioni.addRows(rows, "i");

    const headerRow = sheetRiscossioni.getRow(1)
    headerRow.height = 30
    headerRow.font = Object.assign({}, columnsStyle.font, {bold: true, size: 14})
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFdaebef'},
    }

    if (rows.length > 0) {
      const totalRow = sheetRiscossioni.addRow(["", "Totale", ""])
      totalRow.getCell(3).value = {formula: `SUM(C2:C${totalRow.number - 1})`, result: 0}
      totalRow.height = 20
      totalRow.font = Object.assign({}, columnsStyle.font, {bold: true, size: 14})
      totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFdaebef'},
      }
    }

    return sheetRiscossioni
  }

  _generateResocontoSheet(workbook, data) {
    const sheetResoconto = workbook.addWorksheet('Resoconto', {
      pageSetup: this.pageSetup
    });

    const columnsStyle = {
      font: {size: 12}
    }

    const columns = [
      {
        header: 'Id Contratto', key: "contractNumber",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'center'},
        }),
        width: 15
      },
      {header: 'Nome Utente', key: "name", style: columnsStyle, width: 25},
      {
        header: 'Importo totale',
        key: "amount",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'right'},
          numFmt: '"€" #,##0.00'
        }),
        width: 18
      },
      // {header: 'Tipo Richiesta', key: "type", style: columnsStyle, width: 20},
    ]
    const rows = Object.values(data.reduce((acc, row) => {
      const userId = row.user.id

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          contractNumber: row.user.contractNumber,
          name: row.user.firstName + " " + row.user.lastName,
          amount: row.amount,
          type: RequestTypes.get(row.type).id,
          created_at: moment(row.created_at).toDate(),
          completed_at: moment(row.completed_at).toDate(),
        }
      } else {
        acc[userId].amount += row.amount
      }

      return acc
    }, {}))

    sheetResoconto.columns = columns;
    sheetResoconto.addRows(rows, "i");

    const headerRow = sheetResoconto.getRow(1)
    headerRow.height = 30
    headerRow.font = Object.assign({}, columnsStyle.font, {bold: true, size: 14})
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFe8efda'},
    }

    if (rows.length > 0) {
      const totalRow = sheetResoconto.addRow(["", "Totale", ""])
      totalRow.getCell(3).value = {formula: `SUM(C2:C${totalRow.number - 1})`, result: 0}
      totalRow.height = 20
      totalRow.font = Object.assign({}, columnsStyle.font, {bold: true, size: 14})
      totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFe8efda'},
      }
    }


    return sheetResoconto
  }

  async _generateExcel(data) {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Global Grouup Consulting';
    workbook.lastModifiedBy = 'Global Grouup Consulting';
    workbook.created = new Date();
    workbook.modified = new Date();

    const sheetResoconto = this._generateResocontoSheet(workbook, data)
    const sheetRiscossioni = this._generateRiscossioniSheet(workbook, data)

    const fileName = "report_requests_" + Date.now()
    const filePath = Helpers.tmpPath(fileName)

    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }

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
    const fileName = "receipt_deposit_" + reqData.id.toString()
    const filePath = Helpers.tmpPath(fileName)
    const doc = await this._fillPdf("resources/fileTemplates/receipts_deposit_euro.pdf", filePath, docData)

    response.header('x-file-name', `Integrazione ${reqNumber}.pdf`)

    return response.download(filePath)
  }

  async getRequestsReport({request, response}) {
    /**
     * @type {string}
     * @format YYYY-MM
     */
    const date = request.get()["m"]

    if (!date) {
      throw new Error("Missing date.")
    }

    const data = await RequestModel.getReportData(date)

    const excelFile = await this._generateExcel(data.toJSON())

    response.download(excelFile)
  }

}

module.exports = DocController
