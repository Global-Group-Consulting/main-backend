'use strict'

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server')

const Persona = use('Persona')
const Antl = use('Antl')

const moment = require('moment')
const {get: _get, template: _template, templateSettings: _templateSettings} = require('lodash')
const randtoken = require('rand-token')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/AuthInit',
  'App/Middleware/ConvertEmptyStringsToNull',
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   Auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('Auth')
|
*/
const namedMiddleware = {
  auth: 'App/Middleware/AuthJwt',
  authSuperAdmin: 'App/Middleware/AuthSuperAdmin',
  guest: 'Adonis/Middleware/AllowGuestOnly'
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors'
]

Server
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware)

Persona.registerationRules = function () {
  // disable this control in favor of Validators/users
  return {}
}
Persona.getUserByUids = async function (value) {
  const userQuery = this.getModel().query()

  /**
   * Search for all uids to allow login with
   * any identifier
   */
  this.config.uids.forEach((uid) => userQuery.where(uid, value))

  /**
   * Search for user
   */
  const user = await userQuery.first()
  if (!user) {
    const data = {field: 'uid', validation: 'exists', value}

    throw this.Validator.ValidationException.validationFailed([
      {
        message: this._makeCustomMessage('uid.exists', data, 'Unable to locate user'),
        field: 'uid',
        validation: 'exists'
      }
    ])
  }

  return user
}

Persona.verifyEmail = async function (token) {
  const AccountStatuses = require("../enums/AccountStatuses")
  const tokenRow = await this.getToken(token, 'email')

  if (!tokenRow) {
    throw new Error('The token is invalid or expired')
  }

  const user = tokenRow.getRelated('user')

  /**
   * Update user account only when in the newAccountState
   */
  if ([AccountStatuses.APPROVED].includes(user.account_status)) {
    user.account_status = this.config.verifiedAccountState
    this.removeToken(token, 'email')
    await user.save()
  }

  return user
}

Persona._addTokenConstraints = function (query, type) {
  query
    .where('type', type)
    .where('is_revoked', false)
    .where('updated_at', '>=', moment().subtract(24 * 3, 'hours').format(this.config.dateFormat))
}

Persona.generateToken = async function (user, type) {
  const query = user.tokens()
  this._addTokenConstraints(query, type)

  const row = await query.first()
  if (row) {
    return row.token
  }

  const token = this._encrypter.encrypt(randtoken.generate(16))
  await user.tokens().create({type, token})
  return token
}

Antl.compile = function (locale, key, data) {
  locale = locale || 'it'

  const translation = _get(this._messages, [locale, key].join('.'))

  const tmplString = _template(translation, {
    interpolate: /{([\s\S]+?)}/g
  })

  return tmplString(data || {})
}
