'use strict'

const path = require('path')

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/antl/providers/AntlProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/mail/providers/MailProvider',
  '@adonisjs/persona/providers/PersonaProvider',
  '@adonisjs/session/providers/SessionProvider',
  '@adonisjs/shield/providers/ShieldProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  '@adonisjs/drive/providers/DriveProvider',
  '@adonisjs/websocket/providers/WsProvider',
  'adonis-bumblebee/providers/BumblebeeProvider',
  'lucid-mongo/providers/LucidMongoProvider',
  path.join(__dirname, '..', 'providers', 'EmailSenderProvider'),
  path.join(__dirname, '..', 'providers', 'CustomValidatorProvider'),
  path.join(__dirname, '..', 'providers', 'DocSigner', "provider"),
  path.join(__dirname, '..', 'providers', 'Queue', "provider"),
  path.join(__dirname, '..', 'providers', 'LaravelQueue', "provider"),
  path.join(__dirname, '..', 'providers', 'Acl', "provider"),
  path.join(__dirname, '..', 'providers', 'Addresses', "provider"),
  path.join(__dirname, '..', 'providers', 'Settings', "provider")
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider',
  'adonis-bumblebee/providers/CommandsProvider'
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
  "App/Commands/JobRunner"
]

module.exports = {providers, aceProviders, aliases, commands}
