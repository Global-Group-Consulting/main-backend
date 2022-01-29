'use strict'

const Env = use('Env')
const Mail = use('Mail')
const Antl = use('Antl')
const Config = use('Adonis/Src/Config')

const mjml2html = require('mjml')
const fs = require('fs').promises
const path = require('path')
const { template: _template, get: _get } = require('lodash')
const { ServerClient } = require("postmark");

class EmailSender {
  constructor() {
    /**
     * @type {'smtp' | 'postmark'}
     */
    this.provider = Config.get("mail.connection")

    if (this.provider === "postmark") {
      this.postmarkClient = new ServerClient(Config.get("mail.postmark.apiKey"))
    }
  }

  _getTranslations(tmplName, locale, data) {
    const rawTrans = Antl.forLocale(locale).list()
    const emailTrans = _get(rawTrans, `emails.${tmplName}`)

    const translations = Object.keys(emailTrans.content)
      .reduce((acc, row) => {
        acc[row] = Antl.compile(locale, `emails.${tmplName}.content.${row}`, data)

        return acc
      }, {})

    translations.signature = _get(rawTrans, `emails.signature`)

    return translations
  }

  async _renderTemplate(templateName, locale, data) {
    const tmplPath = path.resolve(__dirname, `../../resources/views/emails/layouts/default.mjml`)
    const tmplFile = await fs.readFile(tmplPath, 'utf-8')
    const translations = this._getTranslations(templateName, locale, data)

    /**
     * @type {TemplateExecutor}
     */
    const tmplCompiler = _template(tmplFile)

    const rawMjml = tmplCompiler({
      t: translations,
      fileToInclude: templateName,
      publicUrl: data.publicUrl
    })

    /**
     * @type {import("mjml")}
     */
    const mjmlTmpl = mjml2html(rawMjml, {
      filePath: path.resolve(__dirname, `../../resources/views/emails/layouts/`)
    })

    if (mjmlTmpl.errors.length > 0) {
      throw new Error(mjmlTmpl.errors.reduce((acc, curr) => {
        acc.push(curr.formattedMessage)

        return acc
      }, []))
    }

    /**
     * @type {TemplateExecutor}
     */
    const htmlCompiler = _template(mjmlTmpl.html)

    return htmlCompiler({
      t: translations,
      data
    })
  }

  /**
   *
   * @param {string} tmpl
   * @param {{}} data
   * @returns {Promise<*>}
   */
  async send(tmpl, data) {
    const locale = data.locale || 'it'
  
    if (data.toObject) {
      data = data.toObject()
    }
  
    data.publicUrl = Env.get('PUBLIC_URL')
    data.publicEmail = Env.get('PUBLIC_EMAIL')
  
    return this.postmarkClient.sendEmailWithTemplate({
      'From': Env.get('MAIL_FROM'),
      'To': data.email,
      // 'Subject': Antl.compile(locale, `emails.${tmpl}.subject`, data),
      'MessageStream': 'outbound',
      "TemplateAlias": tmpl,
      "TemplateModel": data,
    })
  }
}

/**
 * @type {EmailSender}
 */
module.exports = EmailSender
