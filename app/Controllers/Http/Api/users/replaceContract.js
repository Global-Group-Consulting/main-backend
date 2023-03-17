const { castToObjectId } = require('../../../../Helpers/ModelFormatters')
const File = use('App/Models/File')

/**
 * @param request
 * @param {Auth} auth
 * @param {{id: string}} params
 * @return {Promise<File>}
 */
module.exports.replaceContract = async function ({ request, auth, params }) {
  const userId = params.id
  const fileToImport = request.file('file')
  const maintainOld = request.input('maintainOld', false)
  
  if (!maintainOld) {
    const oldFile = await File.where('userId', castToObjectId(userId))
      .where('fieldName', 'contractDoc')
      .first()
    
    if (oldFile) {
      await File.deleteAllWith(oldFile._id)
    }
  }
  
  return File.store([fileToImport], userId, auth.user._id, {
    clientName: fileToImport.clientName,
    extname: 'pdf',
    fileName: 'null',
    fieldName: 'contractDoc',
    type: 'application',
    subtype: 'pdf'
  })
}
