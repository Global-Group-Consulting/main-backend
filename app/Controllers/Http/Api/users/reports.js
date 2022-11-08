/** @type {import('../../../../../providers/Acl/index')} */
const AclProvider = use('AclProvider')

/** @type { import('../../../../Models/User').User} */
const UserModel = use('App/Models/User')

const Helpers = use('Helpers')
const Antl = use('Antl')

const { UsersPermissions } = require('../../../../Helpers/Acl/enums/users.permissions')
const AclGenericException = require('../../../../Exceptions/Acl/AclGenericException')
const UserException = require('../../../../Exceptions/UserException')
const { prepareFiltersQuery } = require('../../../../Filters/PrepareFiltersQuery')
const UserFiltersMap = require('../../../../Filters/UserFilters.map')
const ExcelJS = require('exceljs')
const RequestTypes = require('../../../../../enums/RequestTypes')
const UserRoles = require('../../../../../enums/UserRoles')
const moment = require('moment/moment')
const { accountStatus } = require('../../../../Utilities/Formatters')

const pageSetup = {
  paperSize: 9,
  orientation: 'landscape',
  fitToPage: true,
  showGridLines: true,
  horizontalCentered: true
  // verticalCentered: true
}

const columnsStyle = {
  font: { size: 12 }
}

function _generateFilteredDataSheet (workbook, data) {
  const sheetResoconto = workbook.addWorksheet('Utenti', {
    pageSetup
  })
  
  const columns = [
    { header: 'Id Contratto', key: 'contractNumber', width: 15 },
    { header: 'Nome', key: 'firstName', width: 15 },
    { header: 'Cognome', key: 'lastName', width: 15 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Agente di riferimento', key: 'referenceAgent', width: 30 },
    { header: 'Stato Contratto', key: 'contractStatus', width: 35 },
    { header: 'Stato Account', key: 'account_status', width: 15 },
    { header: 'Ruolo', key: 'role', width: 15 },
    { header: 'Gold', key: 'clubPack', width: 15 }
  ]
  
  const rows = Object.values(data.map((el) => {
    el.referenceAgent = el.referenceAgent ? el.referenceAgentData.firstName + ' ' + el.referenceAgentData.lastName : ''
    el.contractStatus = accountStatus(el)
    el.account_status = Antl.compile('it', 'enums.AccountStatuses.' + el.account_status)
    el.role = Antl.compile('it', 'enums.UserRoles.' + UserRoles.get(el.role).id)
    el.clubPack = Antl.compile('it', 'enums.ClubPacks.' + el.clubPack)
    
    return el
  }))
  
  sheetResoconto.columns = columns
  sheetResoconto.addRows(rows, 'i')
  
  const headerRow = sheetResoconto.getRow(1)
  headerRow.height = 30
  headerRow.font = Object.assign({}, columnsStyle.font, { bold: true, size: 14 })
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFe8efda' }
  }
}

/**
 * Download filtered data in Excel format
 * ONLY FOR ADMINS
 *
 * @param {HttpRequest} request
 * @param {Auth} auth
 *
 * @this {RequestController}
 *
 * @return {Promise<GetCountersDto[]>}
 */
module.exports.downloadFiltered = async function ({ request, auth, response }) {
  const filtersQuery = prepareFiltersQuery(request.pagination.filters, UserFiltersMap)
  
  if (Object.keys(filtersQuery).length === 0) {
    throw new UserException('No filters provided')
  }
  
  // Get data to use
  const data = await UserModel.filter(filtersQuery, [
    '_id',
    'firstName',
    'lastName',
    'email',
    'role',
    'roles',
    'account_status',
    'contractSignedAt',
    'contractPercentage',
    'contractImported',
    'contractNumber',
    'gold',
    'clubPack',
    'commissionsAssigned',
    'referenceAgent'
  ], request.pagination, true)
  
  // Create file structure
  const workbook = new ExcelJS.Workbook()
  
  workbook.creator = 'Global Group Consulting'
  workbook.lastModifiedBy = 'Global Group Consulting'
  workbook.created = new Date()
  workbook.modified = new Date()
  
  // Generate sheet
  _generateFilteredDataSheet(workbook, data)
  
  const fileName = 'utenti_filtrati_' + Date.now()
  const filePath = Helpers.tmpPath(fileName)
  
  // write to a tempFile
  await workbook.xlsx.writeFile(filePath)
  
  response.attachment(filePath)
}
