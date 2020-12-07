'use strict'

/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Persona = use("Persona")
const Env = use("Env")

const UserRoles = require("../../enums/UserRoles")

const User = exports = module.exports = {}

User.onDraftUserConfirmed = async () => {

  // send notification to all servClienti users.
}

User.onIncompleteData = async () => {
  // send notification to users agent
}

User.onMustRevalidate = async () => {

}

/**
 * After the user has been validated and the signRequest has been sent.
 * @returns {Promise<void>}
 */
User.onValidated = async () => {

}

User.onApproved = async (user) => {
  /*
   const userRole = +user.role

   // Dont' send any email for normal users
   if (![UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole)) {
     return
   }*/

  // read the existing token or generate a new one
  const token = user.token || await Persona.generateToken(user, 'email')

  if (!user.sendOnlyEmail) {
    await Queue.add("user_initialize_movements", {
      userId: user._id.toString()
    })
  }

  await Queue.add("send_email", {
    tmpl: "account_approved",
    data: {
      ...user.toJSON(),
      token,
      formLink: `${Env.get('PUBLIC_URL')}/auth/activate?t=${token}`
    }
  })
}
