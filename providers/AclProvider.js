'use strict'

const {ServiceProvider} = require('@adonisjs/fold')
const UserRoles = require('../enums/UserRoles')

const defaultRoles = [
  {
    "code": "super_admin",
    "description": "Permessi totali",
    "permissions": [
      "communications:*",
      "requests:*",
      "users:*",
      "developer:*",
      "translations:*",
      "acl:*",
      "club:*",
      "brites.all:*"
    ],
  },
  {
    "code": "client",
    "description": "Cliente standard",
    "permissions": [
      "users.self:read",
      "users.self:write"
    ],
  },
  {
    "code": "clients_service",
    "description": "Servizio clienti",
    "permissions": [
      "users.all:read"
    ],
  },
  {
    "code": "agent",
    "description": "Agente standard",
    "permissions": [
      "users.self:read"
    ],
  },
  {
    "code": "admin",
    "description": "Permette di leggere la lista di tutti gli utenti",
    "permissions": [
      "communications:*",
      "requests:*",
      "users:*"
    ],
  }
]

class AclProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  async boot() {
    const AclRolesModel = this.app.use("App/Models/AclRolesModel")
    const UserModel = this.app.use("App/Models/User")

    console.log("*** Checking necessary roles...")

    // Adds missing roles.ù
    // In realtà non  server perchè importerò i dati direttamente nel database
    /* for (const role of defaultRoles) {
       const result = await AclRolesModel.createIfNew({code: role.code}, role)

       if (result) {
         console.log("*** Created role", result.code)
       }
     }*/

    const usersWithoutRoles = await UserModel.where({roles: {$exists: false}}).fetch()
    const rolesMap = {
      "admin": "admin",
      "servClienti": "clients_service",
      "agente": "agent",
      "cliente": "client",
    }

    for (const user of usersWithoutRoles.rows) {
      const userRole = UserRoles.get(user.role).id

      user.roles = [rolesMap[userRole]]

      await user.save()
    }
  }
}

module.exports = AclProvider
