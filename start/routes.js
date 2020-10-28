'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const UserRoutes = require('./routes/users.js')
const AuthRoutes = require('./routes/auth.js')
const EmailRoutes = require('./routes/emails.js')

Route.on('/').render('welcome')

UserRoutes(Route)
AuthRoutes(Route)
EmailRoutes(Route)






