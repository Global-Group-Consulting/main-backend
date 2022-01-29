const TokenExpiredException = use("App/Exceptions/TokenExpiredException")

const Env = use("Env")
const SecretKey = use("App/Models/SecretKey");
const AclGenericException = use("App/Exceptions/Acl/AclGenericException");

class AuthJwt {
  async handle({request, auth, response}, next) {
    const scheme = 'jwt'
    let lastError = null
    
    try {
      const authenticator = auth.authenticator(scheme);
      await authenticator.check();
      
      // Also check if the user has access to the requested app
      const apps = auth.user.apps || [];
      // Get the requested app from the client-key provided
      const requestedApp = await SecretKey.getClientApp(request.headers()["client-key"])
      
      if (!apps.includes(requestedApp)) {
        throw new AclGenericException("Permessi insufficienti per accedere a questa applicazione.")
      }
      
      auth.requestedApp = requestedApp;
      
      /**
       * Swapping the main authentication instance with the one using which user
       * logged in.
       */
      auth.authenticatorInstance = authenticator;
      
      lastError = null;
    } catch (error) {
      lastError = error
    }

    if (lastError) {
      throw new TokenExpiredException(lastError.message, lastError.status);
    }

    await next()
  }

  async wsHandle({request, auth, response}, next) {
    try {
      await auth.check()
    } catch (error) {
      throw error
    }

    await next()
  }
}

module.exports = AuthJwt
