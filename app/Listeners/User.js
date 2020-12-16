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
