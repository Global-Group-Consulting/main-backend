const pdf = require('pdf-poppler');
const path = require("path");
const Helpers = use("Helpers")

module.exports = class PdfHandler {
  static options = {
    format: 'jpeg',
    page: 1
  }

  static async toPic(file) {
    const result = await pdf.convert(file, Object.assign({}, this.options, {
      out_dir: Helpers.tmpPath(file),
      out_prefix: path.baseName(file, path.extname(file)),
    }))

  }
}
