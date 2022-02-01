'use strict'

const {ServiceProvider} = require('@adonisjs/fold')
const UserRoles = require('../../enums/UserRoles')

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

class Provider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('AclProvider', () => {
      const Config = this.app.use('Adonis/Src/Config')

      return new (require('.'))(Config)
    })
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
    /*const AclProvider = use('AclProvider')
    const UserModel = this.app.use("App/Models/User")

    console.log("*** Checking necessary roles...")

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
    }*/
  }
}

module.exports = Provider
