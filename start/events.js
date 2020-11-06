const Event = use('Event')

/**
 * @type {import("../providers/EmailSender").default}
 */
const EmailSender = use('EmailSender')

const UserRoles = require("../enums/UserRoles")

Event.on('user::created', async ({ user, token }) => {
  // const userRole = +user.role

  // if ([UserRoles.CLIENTE, UserRoles.AGENTE].includes(userRole)) {
  //   return
  // }

  // await EmailSender.onAccountCreated({
  //   ...user.toObject(),
  //   token
  // })
})

Event.on('user::approved', async ({ user, token }) => {
  const userRole = +user.role

  // Dont' send any email for normal users
  if (![UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole)) {
    return
  }

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

