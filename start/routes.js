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

Route.on('/').render('welcome')

Route.group(() => {
  Route
    .post('/login', 'AuthController.login')
    
  Route
    .post('/reset', 'AuthController.reset')

  Route
    .post('/logout', 'AuthController.logout')
    .middleware('auth')
}).prefix("/auth")

Route.group(() => {
  Route.post('/api/users/add', 'UserController.add')
    .validator('User')

  Route
    .get('/me', 'UserController.me')

  Route
    .get('/:id', 'UserController.show')

  Route.get('/', "UserController.getAll")
}).prefix("/api/users")
  .middleware('auth')
  .namespace('Api')


