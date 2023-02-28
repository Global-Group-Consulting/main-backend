'use strict'

const User = use('App/Models/User')

/** @type {import('../../../providers/LaravelQueue')} */
const LaravelQueue = use('LaravelQueueProvider')

const CalendarHook = exports = module.exports = {}

/**
 *
 * @param {CalendarEvent} modelInstance
 * @return {Promise<void>}
 */
CalendarHook.afterCreate = async (modelInstance) => {
  // if the event is public, send a notification to all users
  if (modelInstance.isPublic) {
  
  }
  
  // if the event is private, send a notification to the users specified in the event
  // userIds is an array of ObjectId
  // authorId is an ObjectId
  // authorId can be the same as one of the userIds
  if (!modelInstance.isPublic) {
    const updatedBy = modelInstance.updatedBy.toString()
    const receivers = getReceivers(modelInstance)
  
    // send the notification
    LaravelQueue.dispatchCreateNotification({
      title: 'Evento aggiornato',
      content: 'Un evento a cui sei collegato è stato aggiornato. Accedi per maggiori dettagli.',
      platforms: ['email'],
      // for each receiver in the array, get the user object
      receivers: await User.where({ '_id': { '$in': receivers } }).select('_id', 'email', 'firstName', 'lastName').fetch(),
      action: {
        text: 'Visualizza evento',
        link: 'Test'
      },
      extraData: {}
    })
    
  }
}

CalendarHook.afterUpdate = async (modelInstance) => {
  // if the event is public, send a notification to all users
  if (modelInstance.isPublic) {
  
  }
  
  // if the event is private, send a notification to the users specified in the event
  // userIds is an array of ObjectId
  // authorId is an ObjectId
  // authorId can be the same as one of the userIds
  if (!modelInstance.isPublic) {
    const updatedBy = modelInstance.updatedBy.toString()
    const receivers = getReceivers(modelInstance)
    
    // send the notification
    LaravelQueue.dispatchCreateNotification({
      title: 'Evento aggiornato',
      content: 'Un evento a cui sei collegato è stato aggiornato. Accedi per maggiori dettagli.',
      platforms: ['email'],
      // for each receiver in the array, get the user object
      receivers: await User.where({ '_id': { '$in': receivers } }).select('_id', 'email', 'firstName', 'lastName').fetch(),
      action: {
        text: 'Visualizza evento',
        link: 'Test'
      },
      extraData: {
        "subject": 'Evento aggiornato',
      }
    })
    
  }
}


function getReceivers(modelInstance) {
  const updatedBy = modelInstance.updatedBy.toString()
  const receivers = []
  
  modelInstance.userIds.reduce((acc, userId, i) => {
      // when i === 0, decide if the authorId present in the acc array is the same as the updatedBy.
      // if so, remove it from the array
      if (i === 0 && acc.includes(updatedBy)) {
        acc.splice(acc.indexOf(updatedBy), 1)
      }
      
      // if the userId is not already in the array, add it
      if (!receivers.includes(userId.toString())) {
        receivers.push(userId.toString())
      }
      
      return acc
    },
    // immediately add the authorId to the receivers
    [modelInstance.authorId.toString()]
  )
  
  return receivers
}
