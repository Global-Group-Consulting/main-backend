const fs = require('fs')
const jsonexport = require('jsonexport')
const path = require('path')

async function exportCsv(data, fileName) {
    const csv = await jsonexport(data);
    const filePath = path.join(__dirname, "../output", fileName)
    
    fs.writeSync(fs.openSync(filePath, 'w'), csv, 'utf8')
    
    console.log(`File ${filePath} created!`)
}

module.exports.exportCsv = exportCsv
