const Event = use('Event')

const EmailController = use("App/Controllers/Http/EmailController")

Event.on('user::resend-activation-mail', async ({ user, token, client_id }) => {
  const loginToken = encodeURIComponent(token)

  email.resendActivation({
    ...user,
    loginToken,
    client_id
  })
})

Event.on('user::forgot-password', async (user) => {
  const emails = new EmailController()

  emails.forgotPassword(user)
})

