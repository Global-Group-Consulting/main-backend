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
Event.on("user::updated", "User.onUpdate")
Event.on("user::firstLogin", "User.onFirstLogin")
Event.on("user::deleted", "User.onDeleted")

Event.on("movements::initial", "Movements.onInitial")

Event.on("request::new", "Request.onNewRequest")
Event.on("request::approved", "Request.onApproved")
Event.on("request::rejected", "Request.onRejected")
Event.on("request::cancelled", "Request.onCancelled")
Event.on("request::autoWithdrawl:completed", "Request.onAutoWithdrawlCompleted")
Event.on("request::autoWithdrawlRecursive:completed", "Request.onAutoWithdrawlRecursiveCompleted")

/**********************************************************************************
 * NOTIFICATIONS
 **********************************************************************************/

// messages & communications
Event.on("notification::messageNew", "Notifications.onMessageNew")

// user status change
Event.on("notification::userDraftConfirmed", "Notifications.onUserDraftConfirmed")
Event.on("notification::userIncompleteData", "Notifications.onUserIncompleteData")
Event.on("notification::userMustRevalidate", "Notifications.onUserMustRevalidate")
Event.on("notification::userValidated", "Notifications.onUserValidated")

// requests new and status change
Event.on("notification::requestNew", "Notifications.onRequestNew")
Event.on("notification::requestRejected", "Notifications.onRequestRejected")
Event.on("notification::requestCancelled", "Notifications.onRequestCancelled")
Event.on("notification::requestApproved", "Notifications.onRequestApproved")

/**********************************************************************************
 * EMAIL
 **********************************************************************************/
Event.on("schedule::notificationEmail", "Emails.scheduleNotificationEmail")
Event.on("cancel::notificationEmail", "Emails.cancelNotificationEmail")
