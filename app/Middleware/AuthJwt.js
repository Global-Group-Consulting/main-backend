const Env = use("Env")

class AuthJwt {
  async handle({ request, auth, response }, next) {
    const scheme = 'jwt'
    let lastError = null

    if (request.hostname() === "localhost" && request.headers()["user-agent"].startsWith("PostmanRuntime") && Env.get("NODE_ENV") === "development") {
      return next()
    }

    try {
      const authenticator = auth.authenticator(scheme)
      await authenticator.check()

      /**
       * Swapping the main authentication instance with the one using which user
       * logged in.
       */
      auth.authenticatorInstance = authenticator

      lastError = null
    } catch (error) {
      lastError = error
    }

    if (lastError) {
      console.info(lastError)
      return response.unauthorized()
    }

    await next()
  }
}

module.exports = AuthJwt
