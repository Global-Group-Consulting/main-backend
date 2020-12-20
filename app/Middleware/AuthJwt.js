const TokenExpiredException = use("App/Exceptions/TokenExpiredException")

const Env = use("Env")

class AuthJwt {
  async handle({request, auth, response}, next) {
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

      throw new TokenExpiredException()
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
