'use strict'

const QueueProvider = use('QueueProvider')
/** @type {import('../../Models/Movement.js')} **/
const Movement = use('App/Models/Movement')
const Request = use('App/Models/Request')
const CronUser = use('App/Models/CronUser')
const User = use('App/Models/User')
const { validate } = use('Validator')
const CronException = use('App/Exceptions/CronException')

/** @type {import('../../../providers/LaravelQueue')} */
const LaravelQueueProvider = use('LaravelQueueProvider')

const { HttpException, LogicalException } = require('@adonisjs/generic-exceptions')
const UserRoles = require('../../../enums/UserRoles')
const AccountStatuses = require('../../../enums/AccountStatuses')
const MovementTypes = require('../../../enums/MovementTypes')
const RequestTypes = require('../../../enums/RequestTypes')
const RequestStatus = require('../../../enums/RequestStatus')
const AclUserRoles = require('../../../enums/AclUserRoles')
const { v4: uuidv4 } = require('uuid')

const { sendCalendarReports } = require('./secredCommand/sendCalendarReports')
const moment = require('moment')
const { castToObjectId } = require('../../Helpers/ModelFormatters')

class SecretCommandController {
  sendCalendarReports = sendCalendarReports

  /**
   * Trigger the agents commissions block
   * @returns {Promise<*>}
   */
  async triggerAllCommissionsBlock () {
    return await QueueProvider.add('trigger_commissions_block_month', {
      attrs: {
        data: {}
      }
    })
  }

  /**
   * Trigger the agents commissions block ONLY for the specified user
   * @param {{id: string}} params
   * @returns {Promise<*>}
   */
  async triggerSingleCommissionsBlock ({ params }) {
    const agentId = params.id
    const validation = await validate(params, {
      id: 'objectId|idExists'
    })

    if (validation.fails()) {
      throw new CronException('Invalid user id.')
    }

    /** @type {Model<User>} */
    const agent = await User.find(agentId)

    let newJob

    /*
        I first must check if the user has the autoWithdrawl active.
        If so, i add to the que an "agent_commissions_auto_withdrawl" job and once this is completed will be added
        the agent_commissions_block.
      */
    if (agent.autoWithdrawlAll) {
      newJob = await QueueProvider.add('agent_commissions_auto_withdrawl', {
        id: agent._id.toString(),
        autoWithdrawlAll: agent.autoWithdrawlAll,
        autoWithdrawlAllRecursively: agent.autoWithdrawlAllRecursively
      })
    } else {
      newJob = await QueueProvider.add('agent_commissions_block', { id: agentId })
    }

    return newJob
  }

  /**
   * Trigger all users month recapitalization
   * @returns {Promise<*>}
   */
  async triggerAllRecapitalization () {
    return await QueueProvider.add('trigger_users_recapitalization', {
      attrs: {
        data: {}
      }
    })
  }

  /**
   * Trigger user month recapitalization ONLY for the specified user
   * @param {{id: string}} params
   * @returns {Promise<*>}
   */
  async triggerSingleRecapitalization ({ params }) {
    const userId = params.id
    const validation = await validate(params, {
      id: 'objectId|idExists'
    })

    if (validation.fails()) {
      throw new CronException('Invalid user id.')
    }

    return await QueueProvider.add('user_recapitalization', {
      userId
    })
  }

  async recapitalizeSingleUser ({ params }) {
    const userId = params.id
    const user = await User.find(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const toReturn = {
      // Generates a uuid that will be used to indicate from where an operation was triggered
      uuid: uuidv4(),
      user: {
        '_id': user._id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'roles': user.roles,
        'contractPercentage': user.contractPercentage,
        'commissionsAssigned': user.commissionsAssigned,
        'agentTeamType': user.agentTeamType,
        'referenceAgent': user.referenceAgent
      },
      recapitalization: null,
      alreadyRecapitalized: false,
      addsAgentCommissions: false,
      dispatchesBriteRecapitalization: false,
      dispatchesAgentCommissionsReinvestment: false
    }

    const currMonth = new Date().getMonth()
    const lastRecapitalization = await Movement.getLastRecapitalization(userId)
    const lastRecapitalizationMonth = lastRecapitalization ? lastRecapitalization.created_at.month() : null

    // Allow only one recapitalization per month
    if (lastRecapitalization && currMonth === lastRecapitalizationMonth) {
      toReturn.recapitalization = lastRecapitalization.toJSON()
      toReturn.alreadyRecapitalized = true

      return toReturn
    }

    // TOLGO QUESTA PARTE PERCHè HO MODIFICATO IL MECCANISMO QUINDI ORA VIENE CREATO UN VERO MOVIMENTO
    // PER LE RICHIESTE RISC_CAPITALE E NON SERVE SOTTRARRE NULLA.

    // Cerco se l'utente ha prelievo deposito in sospeso. Se si, devo prendere l'importo prima della richiesta
    // Recupero tutte le richieste di prelievo deposito in sospeso dell'ultimo mese.
    /*const pendingDepositWithdrawal = await Request.where({
      type: RequestTypes.RISC_CAPITALE,
      status: {$in: [RequestStatus.NUOVA, RequestStatus.LAVORAZIONE]},
      userId: castToObjectId(userId),
      created_at: { $gte: lastRecapitalization.created_at || moment().startOf('day').subtract(1, 'month') }
    }).fetch()

    const pendingAmount = pendingDepositWithdrawal.rows.reduce((acc, curr) => {
      return acc + curr.amount
    }, 0)*/

    /**
     * @type {IMovement}
     */
    const newMovement = {
      userId,
      fromUUID: toReturn.uuid,
      movementType: MovementTypes.INTEREST_RECAPITALIZED,
      interestPercentage: +user.contractPercentage,
      // subtractDeposit: pendingAmount,
    }

    /**
     * @type {IMovement & Document}
     */
    const cratedMovement = await Movement.create(newMovement)

    toReturn.recapitalization = cratedMovement.toJSON()

    // Trigger brite recapitalization only if the amount is > 0
    if (cratedMovement.amountChange) {
      toReturn.dispatchesBriteRecapitalization = true

      LaravelQueueProvider.dispatchBriteRecapitalization({
        fromUUID: toReturn.uuid,
        userId: cratedMovement.userId,
        amount: cratedMovement.amountChange,
        amountEuro: cratedMovement.amountChange
      })
    }

    // Avoid adding this job if the percentage of the user is equal or higher to 4, because the agent would get anything
    if (user.referenceAgent && cratedMovement && cratedMovement.interestPercentage < 4) {
      toReturn.addsAgentCommissions = true

      await QueueProvider.add('agent_commissions_on_total_deposit', {
        fromUUID: toReturn.uuid,
        movementId: cratedMovement._id || toReturn.recapitalization.id,
        agentId: user.referenceAgent
      })
    }

    if (user.role === UserRoles.AGENTE) {
      toReturn.dispatchesAgentCommissionsReinvestment = true

      await QueueProvider.add('agent_commissions_reinvest', { userId, fromUUID: toReturn.uuid })
    }

    return toReturn
  }

  async addAgentCommissionsOnTotalDeposit ({ params }) {
    const movements = await Movement.where({
      movementType: MovementTypes.INTEREST_RECAPITALIZED,
      created_at: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 16) },
      interestPercentage: { $lt: 4 }
    }).fetch()

    for (const movement of movements.rows) {
      const user = await User.find(movement.userId)

      const data = {
        movementId: movement._id,
        fromUUID: movement.fromUUID,
        agentId: user.referenceAgent
      }

      await QueueProvider.add('agent_commissions_on_total_deposit', data)
    }
  }

  async initializeUserMovements ({ request }) {
    const data = request.all()

    if (!data.userId) {
      throw new Error('Missing userId')
    }

    const jobResult = await QueueProvider.add('user_initialize_movements', data)

    return jobResult
  }

  /**
   * Create a cron user to be used for authenticate all cron jobs
   * @param request
   * @returns {Promise<Model>}
   */
  async createCronUser ({ request }) {
    const user = request.only(['username', 'password'])

    if (!user.username || !user.password) {
      throw new CronException('Missing username or password', 400)
    }

    const existingUser = await CronUser.where({ username: user.username }).first()

    if (existingUser) {
      throw new CronException('Can\'t create the required user.', 400)
    }

    return CronUser.create(user)
  }

  async triggerRepayment ({ request }) {
    /**
     * @type {{userId: string, notes: string, amount: number}}
     */
    const data = request.all()
    /** @type {User} */
    const user = await User.find(data.userId)

    return Movement.addRepaymentMovement({
      ...data,
      interestPercentage: user.contractPercentage
    })
  }

  async dispatchBriteRecap () {
    const users = await User.where({
      'role': { '$in': [UserRoles.CLIENTE, UserRoles.AGENTE] },
      'account_status': { '$in': [AccountStatuses.ACTIVE, AccountStatuses.APPROVED] }
    }).fetch()

    for (const user of users.rows) {
      const lastRecap = await Movement.getLastRecapitalization(user._id)

      if (lastRecap && lastRecap.amountChange) {
        LaravelQueueProvider.dispatchBriteRecapitalization({
          userId: lastRecap.userId.toString(),
          amount: lastRecap.amountChange,
          amountEuro: lastRecap.amountChange
        })
      }
    }
  }

}

module.exports = SecretCommandController
