'use strict'

class Create {
  get rules() {
    return {
      title: 'required',
      pdfFile: 'required|file',
      coverFile: 'required|file',
      publicationDate: 'required|string',
      showRange: 'required|array',
    }
  }
}

module.exports = Create
