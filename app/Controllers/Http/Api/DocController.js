'use strict'

/** @type {typeof import('../../../providers/DocSigner')} */
const DocSigner = use('DocSigner')
const Config = use('Config')

/** @type {import('../../../Models/Request')} */
const RequestModel = use('App/Models/Request')
const UserModel = use('App/Models/User')
const MovementModel = use('App/Models/Movement')
const ClubMovementsModel = use('App/Models/ClubMovement')
const Helpers = use('Helpers')
const Antl = use('Antl')
const Env = use('Env')
const { validate, ValidationException, sanitize } = use('Validator')

const AclForbiddenException = use('App/Exceptions/Acl/AclForbiddenException')

const UserRoles = require('../../../../enums/UserRoles')
const RequestTypes = require('../../../../enums/RequestTypes')
const MovementTypes = require('../../../../enums/MovementTypes')
const CurrencyType = require('../../../../enums/CurrencyType')
const ClubPacks = require('../../../../enums/ClubPacks')
const AclUserRoles = require('../../../../enums/AclUserRoles')

const pdfFiller = require('pdffiller')
const ExcelJS = require('exceljs')
const path = require('path')
const moment = require('moment')

const {
  formatDate,
  formatMoney,
  formatWrittenNumbers,
  formatContractNumber,
  formatResidencePlace,
  formatBirthPlace
} = require('../../../Helpers/ModelFormatters')

class DocController {
  get pageSetup () {
    return {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      showGridLines: true,
      horizontalCentered: true
      // verticalCentered: true
    }
  }
  
  async _fillPdf (src, dest, data) {
    
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
  
  _generateRiscossioniSheet (workbook, data, title) {
    const sheetRiscossioni = workbook.addWorksheet(title, {
      pageSetup: this.pageSetup
    })
    
    const columnsStyle = {
      font: { size: 12 },
      alignment: { wrapText: true }
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
        header: 'Id Contratto', key: 'contractNumber',
        style: Object.assign({}, columnsStyle, {
          alignment: { horizontal: 'center' }
        }),
        width: 15
      },
      { header: 'Nome Utente', key: 'name', style: columnsStyle, width: 25 },
      {
        header: 'Importo',
        key: 'amount',
        style: Object.assign({}, columnsStyle, {
          alignment: { horizontal: 'right' },
          numFmt: '"€" #,##0.00'
        }),
        width: 18
      },
      { header: 'Tipo Richiesta', key: 'type', style: columnsStyle, width: 23 },
      { header: 'Pacchetto club', key: 'clubPack', style: columnsStyle, width: 15 },
      { header: 'IBAN', key: 'iban', style: columnsStyle, width: 30 },
      //{header: 'BIC / Swift', key: "bic", style: columnsStyle, width: 15},
      { header: 'Note', key: 'notes', style: columnsStyle, width: 50 },
      { header: 'Note riscossione', key: 'contractNotes', style: columnsStyle, width: 50 },
      { header: 'Agente riferimento', key: 'referenceAgent', style: columnsStyle, width: 25 },
      {
        header: 'Data richiesta', key: 'created_at',
        style: Object.assign({}, columnsStyle, {
          alignment: { horizontal: 'center' },
          numFmt: 'DD/MM/YYYY HH:mm:ss'
        }),
        width: 23
      },
      {
        header: 'Data approvazione', key: 'completed_at',
        style: Object.assign({}, columnsStyle, {
          alignment: { horizontal: 'center' },
          numFmt: 'DD/MM/YYYY HH:mm:ss'
        }),
        width: 23
      }
    ]
    const rows = data.reduce((acc, row) => {
      const iban = []
      
      if (row.iban && row.user.contractIban && row.iban.toLowerCase() !== row.user.contractIban.toLowerCase()) {
      }
      
      (row.iban && iban.push(row.iban.toLowerCase()));
      (row.user.contractIban && iban.push({
        iban: row.user.contractIban.toLowerCase(),
        bic: row.user.contractBic
      }))
      
      let amount = row.amount
      
      if (row.briteConversionPercentage) {
        amount = row.amountEuro || 0
      }
      
      if (amount > 0) {
        acc.push({
          id: row.userId.toString(),
          contractNumber: row.user.contractNumber,
          amount,
          type: Antl.compile('it', `enums.RequestTypes.${RequestTypes.get(row.type).id}`),
          clubPack: Antl.compile('it', `enums.ClubPacks.${row.user.clubPack}`),
          name: row.user.firstName + ' ' + row.user.lastName,
          iban: iban.reduce((acc, curr) => {
            if (typeof curr === 'string') {
              (!acc.includes(curr) && acc.push(curr))
            } else {
              if (!acc.includes(curr.iban)) {
                acc.push(curr.iban + (curr.bic ? ` (BIC: ${curr.bic})` : ''))
              }
            }
            
            return acc
          }, []).join('\n').trim(),
          notes: row.notes,
          contractNotes: row.user.contractNotes,
          referenceAgent: row.user.referenceAgentData ? row.user.referenceAgentData.firstName + ' ' + row.user.referenceAgentData.lastName : '',
          referenceAgentId: row.user.referenceAgent ? row.user.referenceAgent.toString() : '',
          created_at: moment(row.created_at).toDate(),
          completed_at: moment(row.completed_at).toDate()
        })
      }
      
      return acc
    }, [])
    
    sheetRiscossioni.columns = columns
    sheetRiscossioni.addRows(rows, 'i')
    
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].userId) {
        sheetRiscossioni.getCell('B' + (i + 2)).value = {
          text: rows[i].name,
          hyperlink: Env.get('PUBLIC_URL') + '/users/profile/' + rows[i].id,
          tooltip: 'Premi per aprire il profilo dell\'utente'
        }
      }
      
      if (rows[i].referenceAgent) {
        sheetRiscossioni.getCell('I' + (i + 2)).value = {
          text: rows[i].referenceAgent,
          hyperlink: Env.get('PUBLIC_URL') + '/users/profile/' + rows[i].referenceAgentId,
          tooltip: 'Premi per aprire il profilo dell\'utente'
        }
      }
    }
    
    const headerRow = sheetRiscossioni.getRow(1)
    headerRow.height = 30
    headerRow.font = Object.assign({}, columnsStyle.font, { bold: true, size: 14 })
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFdaebef' }
    }
    
    if (rows.length > 0) {
      const totalRow = sheetRiscossioni.addRow(['', 'Totale', ''])
      totalRow.getCell(3).value = { formula: `SUM(C2:C${totalRow.number - 1})`, result: 0 }
      totalRow.height = 30
      totalRow.font = Object.assign({}, columnsStyle.font, { bold: true, size: 14 })
      totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFdaebef' }
      }
    }
    
    return sheetRiscossioni
  }
  
  _generateMovementsReportSheet (workbook, data, user) {
    const sheetRiscossioni = workbook.addWorksheet('Elenco movimenti', {
      pageSetup: this.pageSetup
    })
    
    const columnsStyle = {
      font: { size: 12 },
      alignment: { wrapText: true }
    }
    const currencyStyle = Object.assign({}, columnsStyle, {
      alignment: { horizontal: 'right' },
      numFmt: '"€" #,##0.00'
    })
    const britesStyle = Object.assign({}, columnsStyle, {
      alignment: { horizontal: 'right' },
      numFmt: '"Br\'" #0'
    })
    
    const columns = [
      { header: 'Data', key: 'date', width: 15, style: currencyStyle },
      { header: 'Nuove entrate', key: 'newDeposit', style: currencyStyle, width: 18 },
      { header: 'Deposito', key: 'deposit', style: currencyStyle, width: 20 },
      { header: 'Rendite Maturate', key: 'interests', style: currencyStyle, width: 22 },
      { header: 'Rendite Ricapitalizzate', key: 'interestsRecapitalized', style: currencyStyle, width: 24 },
      { header: 'Rendite Riscosse', key: 'interestsWithdrawn', style: currencyStyle, width: 20 },
      { header: 'Capitale Prelevato', key: 'depositWithdrawn', style: currencyStyle, width: 20 },
      { header: 'Brite Aggiunti', key: 'newBritesDeposit', style: britesStyle, width: 20 },
      { header: 'Brite Ricapitalizzati', key: 'britesRecapitalized', style: britesStyle, width: 20 },
      { header: 'Brite', key: 'brites', style: britesStyle, width: 20 },
      { header: 'Brite usati', key: 'britesWithdrawn', style: britesStyle, width: 20 },
    ]
    const rows = data.map(row => {
      row.date = row._id.year + '-' + row._id.month.toString().padStart(2, '0')
      row.name = user.firstName + ' ' + user.lastName + ' (' + user._id + ')'
      
      return row
    })
    
    sheetRiscossioni.columns = columns
    sheetRiscossioni.addRows(rows, 'i')
    sheetRiscossioni.insertRow(1, [
      user.firstName + ' ' + user.lastName + ' (' + user._id + ')'
    ])
    sheetRiscossioni.mergeCells('A1:H1')
    
    const headerRow = sheetRiscossioni.getRow(1)
    headerRow.height = 30
    headerRow.font = Object.assign({}, columnsStyle.font, { bold: true, size: 14 })
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFffc107' }
    }
    
    const subHeaderRow = sheetRiscossioni.getRow(2)
    subHeaderRow.height = 20
    subHeaderRow.font = Object.assign({}, columnsStyle.font, { bold: true, size: 14 })
    subHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFdaebef' }
    }
    
    sheetRiscossioni.getCell('A1').value = {
      text: sheetRiscossioni.getCell('A1').value,
      hyperlink: Env.get('PUBLIC_URL') + '/users/profile/' + user._id,
      tooltip: 'Premi per aprire il profilo dell\'utente'
    }
    
    return sheetRiscossioni
  }
  
  _generateResocontoSheet (workbook, data) {
    const sheetResoconto = workbook.addWorksheet('Resoconto', {
      pageSetup: this.pageSetup
    })
    
    const columnsStyle = {
      font: { size: 12 }
    }
    
    const columns = [
      {
        header: 'Id Contratto', key: 'contractNumber',
        style: Object.assign({}, columnsStyle, {
          alignment: { horizontal: 'center' }
        }),
        width: 15
      },
      { header: 'Nome Utente', key: 'name', style: columnsStyle, width: 25 },
      {
        header: 'Importo totale',
        key: 'amount',
        style: Object.assign({}, columnsStyle, {
          alignment: { horizontal: 'right' },
          numFmt: '"€" #,##0.00'
        }),
        width: 18
      },
      { header: 'IBAN', key: 'iban', style: columnsStyle, width: 30 },
      { header: 'Note riscossione', key: 'contractNotes', style: columnsStyle, width: 50 },
      { header: 'Agente riferimento', key: 'referenceAgent', style: columnsStyle, width: 25 }
    ]
    const rows = Object.values(data.reduce((acc, row) => {
      const userId = row.user._id.toString()
      const iban = []
      
      if (row.iban && row.user.contractIban && row.iban.toLowerCase() !== row.user.contractIban.toLowerCase()) {
      }
      
      (row.iban && iban.push(row.iban.toLowerCase()));
      (row.user.contractIban && iban.push({
          iban: row.user.contractIban.toLowerCase(),
          bic: row.user.contractBic
        })
      )
      
      let amount = row.amount
      
      if (row.briteConversionPercentage) {
        amount = row.amountEuro || 0
      }
      
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          contractNumber: row.user.contractNumber,
          name: row.user.firstName + ' ' + row.user.lastName,
          amount,
          type: RequestTypes.get(row.type).id,
          referenceAgent: row.user.referenceAgentData ? row.user.referenceAgentData.firstName + ' ' + row.user.referenceAgentData.lastName : '',
          referenceAgentId: row.user.referenceAgent ? row.user.referenceAgent.toString() : '',
          iban: iban.reduce((acc, curr) => {
            if (typeof curr === 'string') {
              (!acc.includes(curr) && acc.push(curr))
            } else {
              if (!acc.includes(curr.iban)) {
                acc.push(curr.iban + (curr.bic ? ` (BIC: ${curr.bic})` : ''))
              }
            }
            
            return acc
          }, []).join('\n').trim(),
          contractNotes: row.user.contractNotes,
          created_at: moment(row.created_at).toDate(),
          completed_at: moment(row.completed_at).toDate()
        }
      } else {
        acc[userId].amount += amount
      }
      
      return acc
    }, {}))
    
    sheetResoconto.columns = columns
    sheetResoconto.addRows(rows, 'i')
    
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].userId) {
        sheetResoconto.getCell('B' + (i + 2)).value = {
          text: rows[i].name,
          hyperlink: Env.get('PUBLIC_URL') + '/users/profile/' + rows[i].userId.toString(),
          tooltip: 'Premi per aprire il profilo dell\'utente'
        }
      }
      
      if (rows[i].referenceAgent) {
        sheetResoconto.getCell('F' + (i + 2)).value = {
          text: rows[i].referenceAgent,
          hyperlink: Env.get('PUBLIC_URL') + '/users/profile/' + rows[i].referenceAgentId,
          tooltip: 'Premi per aprire il profilo dell\'utente'
        }
      }
    }
    
    const headerRow = sheetResoconto.getRow(1)
    headerRow.height = 30
    headerRow.font = Object.assign({}, columnsStyle.font, { bold: true, size: 14 })
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFe8efda' }
    }
    
    if (rows.length > 0) {
      const totalRow = sheetResoconto.addRow(['', 'Totale', ''])
      totalRow.getCell(3).value = { formula: `SUM(C2:C${totalRow.number - 1})`, result: 0 }
      totalRow.height = 30
      totalRow.font = Object.assign({}, columnsStyle.font, { bold: true, size: 14 })
      totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFe8efda' }
      }
    }
    
    return sheetResoconto
  }
  
  async _generateExcel (data) {
    const workbook = new ExcelJS.Workbook()
    
    workbook.creator = 'Global Group Consulting'
    workbook.lastModifiedBy = 'Global Group Consulting'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const sheetResoconto = this._generateResocontoSheet(workbook, data)
    const sheetRiscossioniClassic = this._generateRiscossioniSheet(workbook, data.filter(el => +el.type === RequestTypes.RISC_INTERESSI), 'Riscossione Classic')
    const sheetRiscossioniGold = this._generateRiscossioniSheet(workbook, data.filter(el => [RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(+el.type)), 'Riscossione Gold')
    const sheetDeposito = this._generateRiscossioniSheet(workbook, data.filter(el => +el.type === RequestTypes.RISC_CAPITALE), 'Prelievo Deposito')
    const sheetCommissions = this._generateRiscossioniSheet(workbook, data.filter(el => +el.type === RequestTypes.RISC_PROVVIGIONI), 'Risc. Provvigioni')
    
    const fileName = 'report_requests_' + Date.now()
    const filePath = Helpers.tmpPath(fileName)
    
    await workbook.xlsx.writeFile(filePath)
    
    return filePath
  }
  
  /**
   *
   * @param data
   * @param userId
   * @param user
   * @return {Promise<*>}
   * @private
   */
  async _generateMovementsReportExcel (data, userId, user) {
    const workbook = new ExcelJS.Workbook()
    
    workbook.creator = 'Global Group Consulting'
    workbook.lastModifiedBy = 'Global Group Consulting'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    this._generateMovementsReportSheet(workbook, data, user)
    
    const fileName = 'movements_report_' + userId
    const filePath = Helpers.tmpPath(fileName)
    await workbook.xlsx.writeFile(filePath)
    
    return filePath
  }
  
  async getReceiptDeposit ({ request, auth, response }) {
    const id = request.input('id')
    const type = request.input('type')
    
    let reqData = await RequestModel.findByIdOrMovementId(id, type)
    
    if (!reqData) {
      throw new Error('No request found')
    }
    
    if (reqData.userId.toString() !== auth.user._id.toString()
      && ![UserRoles.SERV_CLIENTI, UserRoles.ADMIN].includes(auth.user.role)) {
      throw new Error('You don\'t have the permissions to read this file.')
    }
    
    if (reqData.type && reqData.type !== RequestTypes.VERSAMENTO
      || reqData.movementType && reqData.movementType !== MovementTypes.DEPOSIT_ADDED) {
      throw new Error('La richiesta o il movimento non è un VERSAMENTO.')
    }
    
    const user = await UserModel.find(reqData.userId)
    const reqNumber = formatContractNumber(user.contractNumber) + '_' + formatDate(reqData.created_at, true, 'DD/MM/YY')
      .replace(/[\/:]/g, '')
      .replace(/ /g, '_')
    const docData = {
      contract_number: formatContractNumber(user.contractNumber),
      full_name: user.firstName + ' ' + user.lastName,
      birth_place: formatBirthPlace(user),
      birth_date: formatDate(user.birthDate) || '',
      residence_place: formatResidencePlace(user),
      req_number: reqNumber,
      amount: formatMoney(reqData.amount || reqData.amountChange || 0),
      amount_text: formatWrittenNumbers(reqData.amount || reqData.amountChange || 0),
      created_at: formatDate(reqData.created_at)
    }
    const fileName = 'receipt_deposit_' + reqData._id.toString()
    const filePath = Helpers.tmpPath(fileName)
    const doc = await this._fillPdf('resources/fileTemplates/receipts_deposit_euro.pdf', filePath, docData)
    
    response.header('x-file-name', `Integrazione ${reqNumber}.pdf`)
    
    return response.download(filePath)
  }
  
  async getRequestsReport ({ request, response }) {
    /**
     * @type {string}
     * @format YYYY-MM
     */
    const date = request.get()['m']
    
    if (!date) {
      throw new Error('Missing date.')
    }
    
    const jsonData = await RequestModel.getReportData(date)
    
    const excelFile = await this._generateExcel(jsonData)
    
    response.download(excelFile)
  }
  
  async getMovementsReport ({ request, auth, response }) {
    const userRoles = auth.user.roles
    const userIsAdmin = userRoles.includes(AclUserRoles.ADMIN) || userRoles.includes(AclUserRoles.SUPER_ADMIN)
    const userId = request.input('userId')
    
    if (!userIsAdmin) {
      throw new AclForbiddenException('Permessi insufficienti.')
    }
    
    // Validate data and eventually throw an error
    const validation = await validate(request.all(), {
      'userId': 'required|objectId'
    })
    
    if (validation.fails()) {
      throw ValidationException.validationFailed(validation.messages())
    }
    
    const user = await UserModel.find(userId)
    const movementsList = await MovementModel.getMovementsReportData(userId)
    const britesList = await ClubMovementsModel.getMovementsReportData(userId)
    const excelFile = await this._generateMovementsReportExcel(movementsList.map(el => {
      const briteGroup = britesList.find(b => b._id.date === el._id.date) || []
      
      return {
        ...el,
        ...briteGroup
      }
    }), userId, user)
    
    response.download(excelFile)
  }
}

module.exports = DocController
