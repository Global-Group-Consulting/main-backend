const TokenExpiredException = use("App/Exceptions/TokenExpiredException")

const Env = use("Env")
const SecretKey = use("App/Models/SecretKey");
const AclGenericException = use("App/Exceptions/Acl/AclGenericException");

class AllowGuestOnly {
  async handle({request, auth, response}, next) {
    let loggedIn = false
    
    try {
      await auth.check()
      loggedIn = true
    } catch (e) {
    }
    
    if (loggedIn) {
      throw new AclGenericException(`Only guest user can access the route ${request.method()} ${request.url()}`, 403, 'E_GUEST_ONLY')
    }
    
    // Also check if the user has access to the requested app
    // Get the requested app from the client-key provided
    auth.requestedApp = await SecretKey.getClientApp(request.headers()["client-key"])
    
    await next()
  }
}

module.exports = AllowGuestOnly
