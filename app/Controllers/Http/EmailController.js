'use strict'

const Env = use('Env')
const Mail = use('Mail')
const Antl = use('Antl')

const mjml2html = require("mjml")
const fs = require("fs").promises
const path = require("path")
const { template: _template, get: _get } = require("lodash")

class EmailController {

  async _renderTemplate(templateName, locale, data) {
    const tmplPath = path.resolve(__dirname, `../../../resources/views/emails/layouts/default.mjml`)
    const tmplFile = await fs.readFile(tmplPath, "utf-8")

    const rawMjml = (_template(tmplFile))({
      fileToInclude: templateName
    })
    const mjmlTmpl = mjml2html(rawMjml, {
      filePath: path.resolve(__dirname, `../../../resources/views/emails/layouts/`)
    })

    if (mjmlTmpl.errors.length > 0) {
      throw new Error(mjmlTmpl.errors.reduce((acc, curr) => {
        acc.push(curr.formattedMessage)

        return acc
      }, []))
    }

    const translations = _get(Antl._store.file[locale], `emails.${templateName}.content`)

    return (_template(mjmlTmpl.html))({
      t: translations,
      data
    })
  }

  async _send(tmpl, data) {
    const locale = data.locale || 'it'

    const emailBody = await this._renderTemplate("password_recover", locale, data)

    return await Mail.raw(emailBody, (message) => {
      message
        .to(data.email)
        .from(Env.MAIL_FROM)
        .subject(Antl.forLocale(locale).get(`emails.${tmpl}.subject`))
    })
  }

  async resendActivation(user){
  
    return await this._send("password_recover", {
      ...user,
      resetToken
    })
  }

  async forgotPassword(user) {
    const resetToken = encodeURIComponent(user.passwordResetToken)

    return await this._send("password_recover", {
      ...user,
      resetToken
    })
  }

}

module.exports = EmailController
