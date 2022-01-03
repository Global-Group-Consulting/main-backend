class AuthBasic {
  async handle ({ auth }, next) {
    const authenticator = auth.authenticator("basic");
    await authenticator.check();

    // using the await allow the errors to be returned to the client
    await next();
  }
}

module.exports = AuthBasic;
