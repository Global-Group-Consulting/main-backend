const FileModel = use('App/Models/File')

const { castToObjectId } = require('../../Helpers/ModelFormatters')

/**
 * For each request in the given data, fetch all related files
 *
 * @param {any[]} data
 * @param {boolean} asBool
 * @return {Promise<any[]>}
 */
module.exports.loadAttachments = async function (data, asBool = false) {
  let query = { requestId: { $in: data.map(request => castToObjectId(request._id)) } }
  const initialMovements = data.filter(request => request.initialMovement)
  
  if (initialMovements.length > 0) {
    query = {
      $or: [
        query,
        {
          userId: { $in: initialMovements.map(request => castToObjectId(request.userId)) },
          fieldName: 'contractInvestmentAttachment'
        }
      ]
    }
  }
  
  const files = await FileModel.where(query).fetch()
  
  // for each request must match the files
  return data.map(request => {
    const relatedFiles = files.rows.reduce((acc, file) => {
      let match
      
      if (request.initialMovement) {
        match = file.userId.toString() === request.userId && file.fieldName === 'contractInvestmentAttachment'
      } else {
        match = file.requestId ? file.requestId.toString() === request._id : false
      }
      
      if (match) {
        // manually override the field name for the initial movement
        file.fieldName = 'requestAttachment'
        file.relatedTo = request.initialMovement ? 'initialMovement' : 'request'
        
        acc.push(file)
      }
      
      return acc
    }, [])
    
    request.hasAttachments = relatedFiles.length > 0
    
    if (asBool) {
      request.files = []
    } else {
      request.files = relatedFiles || []
    }
    
    return request
  })
}
