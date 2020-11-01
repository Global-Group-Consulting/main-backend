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
const AuthRoutes = require('./routes/auth.js')
const DashboardsRoutes = require('./routes/dashboards.js')
const EmailRoutes = require('./routes/emails.js')
const UserRoutes = require('./routes/users.js')

Route.on('/').render('welcome')

AuthRoutes(Route)
DashboardsRoutes(Route)
EmailRoutes(Route)
UserRoutes(Route)






