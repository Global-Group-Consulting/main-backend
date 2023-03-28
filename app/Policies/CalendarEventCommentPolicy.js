const Acl = use('AclProvider')
const CalendarEvent = use('App/Models/CalendarEvent')
const User = use('App/Models/User')
const CalendarEventComment = use('App/Models/CalendarEventComment')
const AclUserRoles = require('../../enums/AclUserRoles')

class CalendarEventCommentPolicy {
  readForEvent ({ auth }) {
    return Acl.checkRoles([...AclUserRoles.admins, AclUserRoles.AGENT], auth)
  }
  
  async upsert ({ auth, params }) {
    const inserting = !params.id
    let canProceed = false
    
    // if adding, the user must be an admin or agent (or the author of the comment)
    // if updating, the user must be the author of the comment
    if (inserting) {
      const userSubAgents = await User.getTeamAgents(auth.user, false, true)
      /**
       * @type {CalendarEvent}
       */
      const event = await CalendarEvent.findOrFail(params.eventId)
      
      if (!event.userIds) {
        event.userIds = []
      }
      
      if (Acl.checkRoles([...AclUserRoles.admins], auth)
        // user is one of the participants of the event
        || event.userIds.find(u => u.toString() === auth.user._id.toString())
        // user is the author of the event
        || event.authorId.toString() === auth.user._id.toString()
        // author is a subAgent of the logged user
        || userSubAgents.find(u => u._id.toString() === event.authorId.toString())
      ) {
        canProceed = true
      }
    } else { // updating
      const message = await CalendarEventComment.findOrFail(params.id)
      
      canProceed = message.authorId.toString() === auth.user._id.toString()
    }
    
    return canProceed
  }
  
  async destroy ({ auth, params }) {
    // the user must be the author of the comment
    const message = await CalendarEventComment.findOrFail(params.id)
    
    return message.authorId.toString() === auth.user._id.toString()
  }
}

module.exports = CalendarEventCommentPolicy
