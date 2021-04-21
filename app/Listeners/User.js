'use strict'

const {addAgentCommission} = require("./Request");

/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Persona = use("Persona")
const Env = use("Env")
const Event = use("Event")
const Ws = use("Ws")
const MovementsModel = use("App/Models/Movement")
const Logger = use("Logger")

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
  // No more necessary as requested by issue #32
  // Event.emit("notification::userValidated", user)
}

User.onApproved = async (user) => {
  // read the existing token or generate a new one
  const token = await Persona.generateToken(user, 'email')
  const userTypeAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+user.role)

  user.token = token;

  await user.save();

  if (!user.sendOnlyEmail && !userTypeAdmin) {
    Logger.info("add job for initializing user movements")

    // Triggers initial movements that will create a request with type new deposit
    await Queue.add("user_initialize_movements", {
      userId: user._id.toString(),
      // added so that the job workers know if the movement must generate agents commission.
      // This may not be the case when importing a movements list.
      calcAgentCommissions: (typeof user.calcAgentCommissions === "boolean" ? user.calcAgentCommissions : true)
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

  Event.emit("notification::userApproved", user)
}

User.onUpdate = async (user) => {
  const channel = Ws.getChannel('account')
  const subscribers = channel.getTopicSubscriptions("account")
  const topic = channel.topic("account")

  // if no one is listening, so the `topic('subscriptions')` method will return `null`
  if (topic) {
    const userEntry = Array.from(subscribers).find(_sub => _sub.user._id.toString() === user._id.toString())

    if (userEntry) {
      topic.emitTo('accountUpdated', user, [userEntry.id])
    }
  }
}

User.onFirstLogin = async (user) => {
  // const movement = await MovementsModel.getInitialInvestment(user._id)

  /*if(!movement){
    throw new Error("Seems that there is no initial movement for the current user.")
  }

  await addAgentCommission(user, movement._id)*/
}
