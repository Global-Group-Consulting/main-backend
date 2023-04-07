const { addAgentCommission } = require('./Request')

/** @type {import('../../providers/Queue')} */
const Queue = use('QueueProvider')
const LaravelQueue = use('LaravelQueueProvider')
const Persona = use('Persona')
const Env = use('Env')
const Event = use('Event')
const Ws = use('Ws')
const MovementsModel = use('App/Models/Movement')
const CommissionsModel = use('App/Models/Commission')
const RequestsModel = use('App/Models/Request')
const Logger = use('Logger')

const UserRoles = require('../../enums/UserRoles')

const { castToObjectId } = require('../Helpers/ModelFormatters')
const moment = require('moment/moment')

const User = exports = module.exports = {}

User.onDraftUserConfirmed = async (user) => {
  // send notification to all servClienti users.
  Event.emit('notification::userDraftConfirmed', user)
}

User.onIncompleteData = async (user) => {
  // send notification to users agent
  Event.emit('notification::userIncompleteData', user)
}

User.onMustRevalidate = async (user) => {
  // send notification to all servClienti users.
  Event.emit('notification::userMustRevalidate', user)
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

/**
 *
 * @param {User} user
 * @return {Promise<void>}
 */
User.onApproved = async (user) => {
  // read the existing token or generate a new one
  const token = await Persona.generateToken(user, 'email')
  const userTypeAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+user.role)
  
  user.token = token
  user.apps = []
  
  if (user.userOnlyClub) {
    user.apps = ['club']
  } else {
    user.apps = ['main', 'club']
  }
  
  await user.save()
  
  if (!user.sendOnlyEmail && !userTypeAdmin && !user.userOnlyClub) {
    Logger.info('add job for initializing user movements')
    
    // Triggers initial movements that will create a request with type new deposit
    await Queue.add('user_initialize_movements', {
      userId: user._id.toString(),
      // added so that the job workers know if the movement must generate agents commission.
      // This may not be the case when importing a movements list.
      calcAgentCommissions: (typeof user.calcAgentCommissions === 'boolean' ? user.calcAgentCommissions : true)
    })
  }
  
  const company = user.userOnlyClub ? 'Global Club' : 'Global Group Consulting'
  const url = user.userOnlyClub ? Env.get('PUBLIC_CLUB_URL') : Env.get('PUBLIC_URL')
  
  await LaravelQueue.dispatchCreateNotification({
    title: `Benvenut${user.gender === 'f' ? 'a' : 'o'} in ${company}!`,
    content: `Siamo lieti di darLe il benvenuto in ${company}!`,
    platforms: ['email'],
    type: 'accountApproved',
    app: user.userOnlyClub ? 'club' : 'main',
    receivers: [
      user
    ],
    action: {
      text: 'Imposta la password',
      link: `${url}/auth/activate?t=${token}`
    }
  })
  
  /*await Queue.add('send_email', {
    tmpl: 'main-account-approved',
    data: {
      ...user.toJSON(),
      token,
      formLink: `${Env.get('PUBLIC_URL')}/auth/activate?t=${token}`
    }
  })*/
  
  // Event.emit('notification::userApproved', user)
  
  user.sendOnlyEmail = false
  
  await user.save()
}

/**
 *
 * @param {{user: User, roleChangeData: {newAgent: string, commissionsReceiver: string}}} data
 * @returns {Promise<void>}
 */
User.onUpdate = async (data) => {
  const channel = Ws.getChannel('account')
  const subscribers = channel.getTopicSubscriptions('account')
  const topic = channel.topic('account')
  
  // Must transfer clients and commissions
  if (data.roleChangeData) {
    
    //if (data.roleChangeData.commissionsReceiver) {
    // EDvent if there is no receiver for the commission, i must set them to 0.
    await Queue.add('transfer_agent_commissions', {
      oldAgent: data.user._id.toString(),
      newAgent: data.roleChangeData.commissionsReceiver
    })
    //}
    
    //if (data.roleChangeData.newAgent) {
    // Even if there isn't a new agent, i reset the agent for its clients
    await Queue.add('transfer_agent_clients', {
      oldAgent: data.user._id.toString(),
      newAgent: data.roleChangeData.newAgent || null
    })
    //}
  }
  
  // if no one is listening, so the `topic('subscriptions')` method will return `null`
  if (topic) {
    const userEntry = Array.from(subscribers).find(_sub => _sub.user._id.toString() === data.user._id.toString())
    
    if (userEntry) {
      topic.emitTo('accountUpdated', data.user, [userEntry.id])
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

User.onDeleted = async (userId) => {
  await MovementsModel.query()
    .where('userId', castToObjectId(userId))
    .delete()
  
  await CommissionsModel.query()
    .where('userId', castToObjectId(userId))
    .delete()
  
  await RequestsModel.query()
    .where('userId', castToObjectId(userId))
    .delete()
}
