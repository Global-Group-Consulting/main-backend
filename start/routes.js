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
const AuthRoutes = require('./routes/auth')
const CommunicationsRoutes = require('./routes/communications')
const FilesRoutes = require('./routes/files')
const DashboardsRoutes = require('./routes/dashboards.js')
const EmailRoutes = require('./routes/emails.js')
const MovementsRoutes = require('./routes/movements.js')
const RequestsRoutes = require('./routes/requests.js')
const UserRoutes = require('./routes/users.js')

Route.on('/').render('welcome')

AuthRoutes(Route)
CommunicationsRoutes(Route)
FilesRoutes(Route)
DashboardsRoutes(Route)
EmailRoutes(Route)
MovementsRoutes(Route)
RequestsRoutes(Route)
UserRoutes(Route)






