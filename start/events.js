const Event = use('Event')

/**
 * @type {import("../providers/EmailSender").default}
 */
const EmailSender = use('EmailSender')

Event.on('user::created', async ({ user, token }) => {
  await EmailSender.onAccountCreated({
    ...user.toObject(),
    token
  })
})

Event.on('forgot::password', async ({ user, token }) => {
  await EmailSender.onPasswordForgot({
    ...user.toObject(),
    token
  })
})

Event.on('password::recovered', async ({ user }) => {
  await EmailSender.onPasswordRecovered({
    ...user.toObject()
  })
})

