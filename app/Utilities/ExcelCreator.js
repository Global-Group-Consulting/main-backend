const ExcelJS = require('exceljs')
const Helpers = use('Helpers')

class ExcelCreator {
  fileTitle = ''
  workbook = null
  columns = []
  sheets = {}
  
  pageSetup = {
    paperSize: 9,
    orientation: 'landscape',
    fitToPage: true,
    showGridLines: true,
    horizontalCentered: true
    // verticalCentered: true
  }
  
  columnsStyle = {
    font: { size: 12 }
  }
  
  constructor (fileTitle, sheetName) {
    this.fileTitle = fileTitle
    
    this.prepareWorkbook()
    this.addSheet(sheetName)
  }
  
  prepareWorkbook () {
    this.workbook = new ExcelJS.Workbook()
    
    this.workbook.creator = 'Global Group Consulting'
    this.workbook.lastModifiedBy = 'Global Group Consulting'
    this.workbook.created = new Date()
    this.workbook.modified = new Date()
  }
  
  addSheet (sheetName) {
    this.sheets[sheetName] = this.workbook.addWorksheet(sheetName, {
      pageSetup: this.pageSetup
    })
  }
  
  /**
   *
   * @param {{header:string, key:string, width: number}[]} columns
   * @param sheetName
   */
  setColumns (columns, sheetName = null) {
    const sheet = sheetName ? this.sheets[sheetName] : this.sheets[Object.keys(this.sheets)[0]]
    
    sheet.columns = columns
  }
  
  /**
   *
   * @param {string[]} columnKeys
   * @param {{}} style
   * @param {string|null} sheetName
   */
  setColumnsStyle (columnKeys, style, sheetName = null) {
    const sheet = sheetName ? this.sheets[sheetName] : this.sheets[Object.keys(this.sheets)[0]]
    
    columnKeys.forEach((key) => {
      const column = sheet.getColumn(key)
      
      column.eachCell((cell) => {
        /*if (!cell.style) {
          return
        }
        */
        // cell.style = Object.assign({}, cell.style, style)
      })
      
    })
  }
  
  setRows (rows, sheetName = null) {
    const sheet = sheetName ? this.sheets[sheetName] : this.sheets[Object.keys(this.sheets)[0]]
    
    sheet.addRows(rows, 'i')
  }
  
  setHeaderStyles () {
    Object.keys(this.sheets).forEach((sheetName) => {
      const sheet = this.sheets[sheetName]
      
      const headerRow = sheet.getRow(1)
      headerRow.height = 25
      headerRow.font = Object.assign({}, this.columnsStyle.font, { bold: true, size: 12 })
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFe8efda' }
      }
    })
  }
  
  async export () {
    this.setHeaderStyles()
    
    const fileName = this.fileTitle
    const filePath = Helpers.tmpPath(fileName)
    await this.workbook.xlsx.writeFile(filePath)
    
    return filePath
  }
}

module.exports = { ExcelCreator }
