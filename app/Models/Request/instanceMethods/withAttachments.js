const FileModel = use('App/Models/File')

module.exports.withAttachments = async function (data, asBool = false) {
  let query = { requestId: this._id }
  
  if (this.initialMovement) {
    query = {
      $or: [
        query,
        {
          userId: this.userId,
          fieldName: 'contractInvestmentAttachment'
        }
      ]
    }
  }
  
  this.files = await FileModel.where(query).fetch()
  
  if (this.initialMovement) {
    this.files.rows.forEach(file => {
      // manually override the field name for the initial movement
      file.fieldName = 'requestAttachment'
      file.relatedTo = 'initialMovement'
    })
  }
}
