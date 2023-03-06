const User = use('App/Models/User')
const CalendarEvent = use('App/Models/CalendarEvent')

/** @type {import('../../../../providers/LaravelQueue')} */
const LaravelQueueProvider = use('LaravelQueueProvider')

const AclUserRoles = require('../../../../enums/AclUserRoles')
const { castToObjectId } = require('../../../Helpers/ModelFormatters')

const userFields = ['_id', 'email', 'roles', 'firstName', 'lastName']

const times = {
  morning: 7,
  evening: 17
}

module.exports.sendCalendarReports = async () => {
  // Based on the current time, decide il the report should be sent to agents and admins or only admins
  let agentEmails = await sendAgentsReport()
  let adminEmails = await sendAdminsReport()
  
  return {
    agents: agentEmails,
    admins: adminEmails
  }
}

/**
 * Send the daily calendar report to agents
 * If the time is between 7:00 and 17:00 UTC, send the report to all agents
 * otherwise, avoid sending it
 *
 * @return {Promise<{user: string, events: any[], error: string}[]>}
 */
async function sendAgentsReport () {
  const now = new Date()
  const agentEmails = []
  const isMorning = now.getUTCHours() >= times.morning && now.getUTCHours() < times.evening
  
  // if time not between 7:00 and 17 UTC, avoid sending the report to agents
  if (!isMorning) {
    return []
  }
  
  // get all agents
  const agents = await User.where({ roles: AclUserRoles.AGENT }).select(userFields).fetch()
  
  // For each agent, get all today's events and send the report
  await Promise.all(agents.rows.map(async (user) => {
    try {
      // get all today's events
      const events = (await user.todayCalendarEvents(user._id)).rows
      
      // I can't show the event's date in the email, because I don't know the timezone of the user
      // for each event, add a date field with the start and end date formatted
      /*events.forEach((event) => {
        event.date = moment(event.start).format('DD/MM/YYYY') + ' - ' + moment(event.end).format('DD/MM/YYYY')
      })*/
      
      // if there are no events, avoid sending the report
      if (events.length === 0) {
        return
      }
      
      // send the report
      await LaravelQueueProvider.dispatchAgentDailyCalendarReport(user, events)
      
      // add the user and the events to the list of sent reports
      agentEmails.push({
        user: user.email,
        events: events.map((event) => event._id.toString())
      })
    } catch (e) {
      // if an error occurs, add the user and the error to the list of sent reports
      agentEmails.push({
        user: user.email,
        events: [],
        error: e.toString()
      })
    }
  }))
  
  // return the list of sent reports
  return agentEmails
}

/**
 *
 * @return {Promise<{user: string, events: any[], error: string}[]>}
 */
async function sendAdminsReport () {
  const now = new Date()
  const adminEmails = []
  const isMorning = now.getUTCHours() >= times.morning && now.getUTCHours() < times.evening
  
  // get all admin users
  const admins = (await User.where({ roles: AclUserRoles.ADMIN })
    .select(userFields)
    .fetch()).rows
  const dayStart = new Date(new Date().setUTCHours(0, 0, 0, 0))
  const dayEnd = new Date(new Date().setUTCHours(23, 59, 59, 999))
  
  // if time is between 7:00 and 17:00 UTC, get all today's events
  let query = {
    $and: [
      { start: { $gte: dayStart } },
      { start: { $lte: dayEnd } }
    ]
  }
  
  // if time is after 17:00, get all created today's events
  if (!isMorning) {
    query = {
      $and: [
        { created_at: { $gte: dayStart } },
        { created_at: { $lte: dayEnd } }
      ]
    }
  }
  
  /**
   * get events based on the query
   * @type {CalendarEvent[]}
   */
  const adminEvents = (await CalendarEvent.where(query).fetch()).rows
  
  // I can't show the event's date in the email, because I don't know the timezone of the user
  /*adminEvents.forEach((event) => {
    event.date = moment(event.start).format('DD/MM/YYYY') + ' - ' + moment(event.end).format('DD/MM/YYYY')
  })*/
  
  // if no events, avoid sending the report
  if (!adminEvents.length) {
    return []
  }
  
  // Group events by agent
  const groupedEvents = adminEvents.reduce((acc, event) => {
    // if the event is public, add it to the "public" array
    if (event.isPublic) {
      if (!acc['public']) {
        acc['public'] = []
      }
      
      acc['public'].push(event)
    } else {
      // For each user in the event's users array, add the event to the user's array
      event.userIds.forEach((user) => {
        const userId = user.toString()
        
        if (!acc[userId]) {
          acc[userId] = []
        }
        
        acc[userId].push(event)
      })
    }
    
    return acc
  }, {})
  
  // create ad array of user ids as ObjectId. This will be eventually used to fetch the users data
  const userIds = Object.keys(groupedEvents).reduce((acc, key) => {
    // ignore the public events
    if (key === 'public') {
      return acc
    }
    
    // add the user id as an ObjectId to the array
    acc.push(castToObjectId(key))
    
    return acc
  }, [])
  
  /**
   * Final array of events to send to the email template
   * @type {{user: string, events: CalendarEvent[]}[]}
   */
  const eventsToSend = []
  
  // if there are user ids, fetch the users data
  if (userIds.length) {
    // On the groupedEvents, for each id, must fetch the related user data
    const users = (await User.where({ _id: { $in: userIds } }).select(userFields).fetch()).rows
    
    // add agent events
    users.forEach((user) => {
      const userId = user._id.toString()
      eventsToSend.push({
        userName: user.firstName + ' ' + user.lastName,
        user,
        events: groupedEvents[userId]
      })
    })
  }
  
  // add public events if any
  if (groupedEvents['public']) {
    eventsToSend.push({
      userName: 'Eventi pubblici',
      user: null,
      events: groupedEvents['public']
    })
  }
  
  // For each admin, send the report
  await Promise.all(admins.map(async (user) => {
      try {
        // send the report and pass the eventsToSend array
        await LaravelQueueProvider.dispatchAdminDailyCalendarReport(user, eventsToSend, isMorning, {
          start: [dayStart, dayEnd]
        })
        
        // add the user and the events to the list of sent reports
        adminEmails.push({
          user: user.email,
          // use original adminEvents array to get the event ids
          events: adminEvents.map((event) => event._id.toString())
        })
      } catch (e) {
        // if an error occurs, add the user and the error to the list of sent reports
        adminEmails.push({
          user: user.email,
          events: [],
          error: e
        })
      }
    })
  )
  
  return adminEmails
}
