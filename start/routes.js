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
const AclRoutes = require('./routes/acl')
const AuthRoutes = require('./routes/auth')
const CommissionsRoutes = require('./routes/commissions')
const CommunicationsRoutes = require('./routes/communications')
const FilesRoutes = require('./routes/files')
const DashboardsRoutes = require('./routes/dashboards.js')
const DocsRoutes = require('./routes/docs.js')
const MovementsRoutes = require('./routes/movements.js')
const RequestsRoutes = require('./routes/requests.js')
const UserRoutes = require('./routes/users.js')
const WebhooksRoutes = require('./routes/webhooks.js')

Route.on('/').render('welcome')

AclRoutes(Route)
AuthRoutes(Route)
CommissionsRoutes(Route)
CommunicationsRoutes(Route)
FilesRoutes(Route)
DashboardsRoutes(Route)
DocsRoutes(Route)
MovementsRoutes(Route)
RequestsRoutes(Route)
UserRoutes(Route)
WebhooksRoutes(Route)

Route.group(() => {
  Route.post("/commissions_block", "SecretCommandController.triggerCommissionsBlock")
  Route.post("/recapitalization", "SecretCommandController.triggerUsersRecapitalization")
  Route.post("/initialize_movements", "SecretCommandController.initializeUserMovements")
}).prefix('/645xcv654asd982347')
  .middleware("authSuperAdmin")


/*
Route.post("/docs/create", "DocSignController.createDocument")
Route.get("/docs/docs", "DocSignController.readDocuments")
Route.post("/docs/docs", "DocSignController.sendDocument")
Route.delete("/docs/docs/:uuid", "DocSignController.deleteDocument")
*/





