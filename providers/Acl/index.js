const AuthProvider = use("Adonis/Middleware/Auth")
const Request = use('Adonis/Src/Request')

class Acl {
  constructor(Config) {
    this.Config = Config
    this._queuesPool = {}

  }

  async _getUserPermissions(user) {
    const permissions = await user.permissions()
    return permissions
  }

  /**
   *
   * @param  {string} permission
   * @returns {{access: string, section: string, type: string}}
   * @private
   */
  _permissionParts(permission) {
    const blocks = permission.split(/\.|:/)
    const toReturn = {section: "", type: "", access: ""}

    switch (blocks.length) {
      case 2:
        toReturn.section = blocks[0]
        toReturn.access = blocks[1]
        break;
      case 3:
        toReturn.section = blocks[0]
        toReturn.type = blocks[1]
        toReturn.access = blocks[2]
        break;
    }

    return toReturn
  }

  /**
   *
   * @param {string[]} requiredPermissions
   * @param {{user: any}} auth
   * @returns {boolean}
   */
  async checkPermissions(requiredPermissions, auth) {
    const userPermissions = await this._getUserPermissions(auth.user)
    let toReturn = false

    /*
    If no permission in required, return true
     */
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    /*
    If the user has no permissions, but at least one is required, return false
     */
    if (!userPermissions) {
      return toReturn
    }

    reqPermissionsCycle: for (const permission of requiredPermissions) {
      const parts = this._permissionParts(permission)

      if (!parts.section || !parts.access) {
        continue
      }

      for (const userPermission of userPermissions) {
        const userParts = this._permissionParts(userPermission)

        /*
        Because the "type" does not always exists, if the permission has it and the user's one is different
        and the user has no wildcard, skip this userPermission, because is not valid
         */

        if ((parts.type && userParts.type !== parts.type && userParts.type !== "*")
          || (parts.access && userParts.access !== parts.access && userParts.access !== "*")) {
          continue
        }

        /*
        La soluzione migliore sarebbe prevedere una wildcard sia peril type che per l'access.
         */


        /*
         If the section matches and the access matches of the user has access *, return true
         and stop all the cycles.
         */
        if (parts.section === userParts.section &&
          (userParts.type === parts.type || userParts.type === "*") &&
          (userParts.access === parts.access || userParts.access === "*")) {
          toReturn = true

          // Once i found a valid match, stop all the cycles
          break reqPermissionsCycle;
        }
      }
    }

    return toReturn
  }
}

module.exports = Acl
