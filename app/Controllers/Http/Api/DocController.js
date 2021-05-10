'use strict'

/** @type {typeof import("../../../providers/DocSigner")} */
const DocSigner = use("DocSigner")
const Config = use("Config")

/** @type {import("../../../Models/Request")} */
const RequestModel = use("App/Models/Request")
const Helpers = use("Helpers")
const Antl = use('Antl')
const Env = use('Env')

const UserRoles = require("../../../../enums/UserRoles")
const RequestTypes = require("../../../../enums/RequestTypes")
const CurrencyType = require("../../../../enums/CurrencyType");
const ClubPacks = require("../../../../enums/ClubPacks");

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

    /**
     * Sembra essere necessari la presenza di https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/
     * pdf toolkit
     */
    return new Promise((resolve, reject) => {
      pdfFiller.fillFormWithFlatten(src, dest, data, true, function (err) {
        if (err) {
          return reject(err)
        }

        resolve(this)
      })
    })
  }

  _generateRiscossioniSheet(workbook, data, title) {
    const sheetRiscossioni = workbook.addWorksheet(title, {
      pageSetup: this.pageSetup,
    });

    const columnsStyle = {
      font: {size: 12},
      alignment: {wrapText: true}
    }

    /*
    fields:
      Importo
      Tipo richiesta
      Nome Cognome
      IBAN
      BIC
      Note
      Agente riferimento
     */
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
      {header: 'Tipo Richiesta', key: "type", style: columnsStyle, width: 23},
      {header: 'Pacchetto club', key: "clubPack", style: columnsStyle, width: 15},
      {header: 'IBAN', key: "iban", style: columnsStyle, width: 30},
      //{header: 'BIC / Swift', key: "bic", style: columnsStyle, width: 15},
      {header: 'Note', key: "notes", style: columnsStyle, width: 50},
      {header: 'Agente riferimento', key: "referenceAgent", style: columnsStyle, width: 25},
      {
        header: 'Data richiesta', key: "created_at",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'center'},
          numFmt: "DD/MM/YYYY HH:mm:ss"
        }),
        width: 23
      },
      {
        header: 'Data approvazione', key: "completed_at",
        style: Object.assign({}, columnsStyle, {
          alignment: {horizontal: 'center'},
          numFmt: "DD/MM/YYYY HH:mm:ss"
        }),
        width: 23
      },
    ]
    const rows = data.reduce((acc, row) => {
      const iban = [];

      if (row.iban && row.user.contractIban && row.iban.toLowerCase() !== row.user.contractIban.toLowerCase()) {
      }

      (row.iban && iban.push(row.iban.toLowerCase()));
      (row.user.contractIban && iban.push({
          iban: row.user.contractIban.toLowerCase(),
          bic: row.user.contractBic
        })
      );


      acc.push({
        id: row.userId.toString(),
        contractNumber: row.user.contractNumber,
        amount: row.amount,
        type: Antl.compile('it', `enums.RequestTypes.${RequestTypes.get(row.type).id}`),
        clubPack: Antl.compile('it', `enums.ClubPacks.${row.user.clubPack}`),
        name: row.user.firstName + " " + row.user.lastName,
        iban: iban.reduce((acc, curr) => {
          if (typeof curr === "string") {
            (!acc.includes(curr) && acc.push(curr));
          } else {
            if (!acc.includes(curr.iban)) {
              acc.push(curr.iban + (curr.bic ? ` (BIC: ${curr.bic})` : ''));
            }
          }

          return acc
        }, []).join("\n").trim(),
        notes: row.notes,
        referenceAgent: row.user.referenceAgentData ? row.user.referenceAgentData.firstName + " " + row.user.referenceAgentData.lastName : "",
        referenceAgentId: row.user.referenceAgent ? row.user.referenceAgent.toString() : '',
        created_at: moment(row.created_at).toDate(),
        completed_at: moment(row.completed_at).toDate(),
      })

      return acc
    }, [])

    sheetRiscossioni.columns = columns;
    sheetRiscossioni.addRows(rows, "i");

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].userId) {
        sheetRiscossioni.getCell('B' + (i + 2)).value = {
          text: rows[i].name,
          hyperlink: Env.get("PUBLIC_URL") + "/users/profile/" + rows[i].id,
          tooltip: "Premi per aprire il profilo dell'utente"
        };
      }

      if (rows[i].referenceAgent) {
        sheetRiscossioni.getCell('H' + (i + 2)).value = {
          text: rows[i].referenceAgent,
          hyperlink: Env.get("PUBLIC_URL") + "/users/profile/" + rows[i].referenceAgentId,
          tooltip: "Premi per aprire il profilo dell'utente"
        };
      }
    }

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
      totalRow.height = 30
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
      {header: 'IBAN', key: "iban", style: columnsStyle, width: 30},
      {header: 'Agente riferimento', key: "referenceAgent", style: columnsStyle, width: 25},
    ]
    const rows = Object.values(data.reduce((acc, row) => {
      const userId = row.user.id
      const iban = [];

      if (row.iban && row.user.contractIban && row.iban.toLowerCase() !== row.user.contractIban.toLowerCase()) {
      }

      (row.iban && iban.push(row.iban.toLowerCase()));
      (row.user.contractIban && iban.push({
          iban: row.user.contractIban.toLowerCase(),
          bic: row.user.contractBic
        })
      );

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          contractNumber: row.user.contractNumber,
          name: row.user.firstName + " " + row.user.lastName,
          amount: row.amount,
          type: RequestTypes.get(row.type).id,
          referenceAgent: row.user.referenceAgentData ? row.user.referenceAgentData.firstName + " " + row.user.referenceAgentData.lastName : "",
          referenceAgentId: row.user.referenceAgent ? row.user.referenceAgent.toString() : '',
          iban: iban.reduce((acc, curr) => {
            if (typeof curr === "string") {
              (!acc.includes(curr) && acc.push(curr));
            } else {
              if (!acc.includes(curr.iban)) {
                acc.push(curr.iban + (curr.bic ? ` (BIC: ${curr.bic})` : ''));
              }
            }

            return acc
          }, []).join("\n").trim(),
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

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].userId) {
        sheetResoconto.getCell('B' + (i + 2)).value = {
          text: rows[i].name,
          hyperlink: Env.get("PUBLIC_URL") + "/users/profile/" + rows[i].userId.toString(),
          tooltip: "Premi per aprire il profilo dell'utente"
        };
      }

      if (rows[i].referenceAgent) {
        sheetResoconto.getCell('E' + (i + 2)).value = {
          text: rows[i].referenceAgent,
          hyperlink: Env.get("PUBLIC_URL") + "/users/profile/" + rows[i].referenceAgentId,
          tooltip: "Premi per aprire il profilo dell'utente"
        };
      }
    }

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
      totalRow.height = 30
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
    const sheetRiscossioniClassic = this._generateRiscossioniSheet(workbook, data.filter(el => +el.type === RequestTypes.RISC_INTERESSI), "Riscossione Classic")
    const sheetRiscossioniGold = this._generateRiscossioniSheet(workbook, data.filter(el => [RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(+el.type)), "Riscossione Gold")
    const sheetDeposito = this._generateRiscossioniSheet(workbook, data.filter(el => +el.type === RequestTypes.RISC_CAPITALE), "Prelievo Deposito")
    const sheetCommissions = this._generateRiscossioniSheet(workbook, data.filter(el => +el.type === RequestTypes.RISC_PROVVIGIONI), "Risc. Provvigioni")

    const fileName = "report_requests_" + Date.now()
    const filePath = Helpers.tmpPath(fileName)

    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }

  async getReceiptDeposit({request, auth, response}) {
    const requestId = request.input("id")
    let reqData = await RequestModel.findByIdOrMovementId(requestId)

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
      birth_date: formatDate(user.birthDate) || "",
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

    const jsonData = await RequestModel.getReportData(date)

    const excelFile = await this._generateExcel(jsonData)

    response.download(excelFile)
  }

}

module.exports = DocController
