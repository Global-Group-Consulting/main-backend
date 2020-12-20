'use strict'

/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Persona = use("Persona")
const Env = use("Env")
const Event = use("Event")

const UserRoles = require("../../enums/UserRoles")

const User = exports = module.exports = {}

User.onDraftUserConfirmed = async (user) => {
  // send notification to all servClienti users.
  Event.emit("notification::userDraftConfirmed", user)
}

User.onIncompleteData = async (user) => {
  // send notification to users agent
  Event.emit("notification::userIncompleteData", user)
}

User.onMustRevalidate = async (user) => {
  // send notification to all servClienti users.
  Event.emit("notification::userMustRevalidate", user)
}

/**
 * After the user has been validated and the signRequest has been sent.
 * @returns {Promise<void>}
 */
User.onValidated = async (user) => {
  // send notification to all admin users.
  Event.emit("notification::userValidated", user)
}

User.onApproved = async (user) => {
  // read the existing token or generate a new one
  const token = user.token || await Persona.generateToken(user, 'email')
  const userType = [UserRoles.AGENTE, UserRoles.SERV_CLIENTI].includes(+user.role) ? "admin" : "user"

  if (!user.sendOnlyEmail && userType !== "admin") {
    await Queue.add("user_initialize_movements", {
      userId: user._id.toString(),
      // added so that the job workers know if the movement must generate agents commission.
      // This may not be the case when importing a movements list.
      calcAgentCommissions: typeof user.calcAgentCommissions === "boolean" ? user.calcAgentCommissions : true
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
