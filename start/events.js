const Event = use('Event')
/** @type {import("../providers/EmailSender").default} */
const EmailSender = use('EmailSender')
const UserRoles = require("../enums/UserRoles")

// Auth events triggered by Persona
Event.on('user::created', async ({user, token}) => {
  // Won't do nothing because my user activation is different
  // from the one of Persona
})
Event.on('forgot::password', "Auth.onPasswordForgot")
Event.on('password::recovered', "Auth.onPasswordRecovered")

// User STATUS events
Event.on("user::draftConfirmed", "User.onDraftUserConfirmed")
Event.on("user::incomplete", "User.onIncompleteData")
Event.on("user::mustRevalidate", "User.onMustRevalidate")
Event.on("user::validated", "User.onValidated")
Event.on("user::approved", "User.onApproved")

Event.on("request::approved", "Request.onApproved")
