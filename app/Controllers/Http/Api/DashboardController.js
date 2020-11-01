'use strict'

const UsersController = use("App/Controllers/Http/Api/UserController")

class DashboardController {

  async getByRole({ auth }) {
    // const userRole = auth.user.role
    const userController = new UsersController()

    return {
      validatedUsers: await userController.getValidatedUsers(),
      pendingRequests: []
    }
  }
}

module.exports = DashboardController
