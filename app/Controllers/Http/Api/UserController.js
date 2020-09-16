'use strict'

const User = use("App/Models/User")

class UserController {
  async add({ request, auth, response }) {
    const username = request.input("username")
    const email = request.input("email")
    const password = request.input("password")

    let user = new User()
    user.username = username
    user.email = email
    user.password = password

    user = await user.save()
    //let accessToken = await auth.generate(user)
    //return response.json({ "user": user, "access_token": accessToken })

    return response.json({ user })
  }

  async show({ params }) {
    const user = await User.find(params.id)

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  me({ auth, params }) {
    /*if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }*/
    return auth.user
  }

  async getAll() {
    return User.all()
  }
}

module.exports = UserController
