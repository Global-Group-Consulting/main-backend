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
const Route = use('Route');
const Logger = use("Logger");
const Env = use("Env");

const AclRoutes = require('./routes/acl');
const AuthRoutes = require('./routes/auth');
const AgentBrites = require('./routes/agentBrites');
const ClubRoutes = require('./routes/club');
const CommissionsRoutes = require('./routes/commissions');
const CommunicationsRoutes = require('./routes/communications');
const FilesRoutes = require('./routes/files');
const DashboardsRoutes = require('./routes/dashboards.js');
const DocsRoutes = require('./routes/docs.js');
const MovementsRoutes = require('./routes/movements.js');
const RequestsRoutes = require('./routes/requests.js');
const SettingsRoutes = require('./routes/settings.js');
const UserRoutes = require('./routes/users.js');
const WebhooksRoutes = require('./routes/webhooks.js');
const MagazineRoutes = require('./routes/magazine.js');
const ReportsRoutes = require('./routes/reports.js');
const FiltersRoutes = require('./routes/filters');
const ProxyRoutes = require('./routes/proxy');
const GeolocationRoutes = require('./routes/geolocation');
const NewsRoutes = require('./routes/news');

Route.on('/').render('welcome');

// AclRoutes(Route);
AuthRoutes(Route);
AgentBrites(Route);
ClubRoutes(Route);
CommissionsRoutes(Route);
CommunicationsRoutes(Route);
FilesRoutes(Route);
DashboardsRoutes(Route);
DocsRoutes(Route);
MovementsRoutes(Route);
RequestsRoutes(Route);
SettingsRoutes(Route);
UserRoutes(Route);
WebhooksRoutes(Route);
MagazineRoutes(Route);
ReportsRoutes(Route);
FiltersRoutes(Route);
// Set this route at the end due to the use of the wildcard
ProxyRoutes(Route);
GeolocationRoutes(Route);
NewsRoutes(Route);

// const secretRoutePath = Env.get("NODE_ENV") === "development" ? "secretRoute" : Buffer.from(Date.now().toString()).toString('base64');

Route.group(() => {
  Route.put("/initialize_user_movements", "SecretCommandController.initializeUserMovements");
  
  // commissions
  Route.put("/block_commissions_all", "SecretCommandController.triggerAllCommissionsBlock");
  Route.put("/block_commissions/:id", "SecretCommandController.triggerSingleCommissionsBlock");
  
  // recapitalization
  Route.put("/recapitalize_all", "SecretCommandController.triggerAllRecapitalization");
  Route.put("/recapitalize/:id", "SecretCommandController.recapitalizeSingleUser");
  
  Route.put("/dispatch_brite_recap", "SecretCommandController.dispatchBriteRecap");
  
  Route.put("/repayment", "SecretCommandController.triggerRepayment")
    .validator('App/Validators/Movements/TriggerRepayment');
  
  // Route.post("/initialize_movements", "SecretCommandController.initializeUserMovements");
}).prefix(process.env.SERVER_KEY)
  .middleware("authBasic");

Route.post(`/${process.env.SERVER_KEY}/cronUser`, "SecretCommandController.createCronUser");

// Logger.info("*** Generated secret routes at /" + process.env.SERVER_KEY + "/");

/*
Route.post("/docs/create", "DocSignController.createDocument")
Route.get("/docs/docs", "DocSignController.readDocuments")
Route.post("/docs/docs", "DocSignController.sendDocument")
Route.delete("/docs/docs/:uuid", "DocSignController.deleteDocument")
*/

