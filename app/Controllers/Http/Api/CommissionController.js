'use strict'

/** @type {typeof import('../../../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

/** @type {typeof import('../../../Models/Request')} */
const RequestModel = use('App/Models/Request')

/** @type {typeof import('../../../Models/User')} */
const UserModel = use('App/Models/User')

/** @type {import('../../../../@types/Acl/AclProvider').AclProvider} */
const AclProvider = use('AclProvider')
const Event = use('Event')

const AgentBrite = use('App/Models/AgentBrite')

const UserRoles = require('../../../../enums/UserRoles')
const RequestTypes = require('../../../../enums/RequestTypes')
const WalletTypes = require('../../../../enums/WalletTypes')
const CurrencyType = require('../../../../enums/CurrencyType')
const CommissionType = require('../../../../enums/CommissionType')
const AclGenericException = require('../../../Exceptions/Acl/AclGenericException')

const { CommissionsPermissions } = require('../../../Helpers/Acl/enums/commissions.permissions')

const { castToObjectId, castToIsoDate } = require('../../../Helpers/ModelFormatters')
const { MovementsPermissions } = require('../../../Helpers/Acl/enums/movements.permissions')
const MovementErrorException = require('../../../Exceptions/MovementErrorException')

class CommissionController {
  async read () {
    return CommissionModel.fetchAll()
  }
  
  /**
   * Commission that occurs each time a client of an agent invest new money
   * @returns {Promise<void>}
   */
  async addNewDepositCommission () {
    const movementId = '5fc56e27cb9b9012e64b7689'
    
    return CommissionModel.addNewDepositCommission(movementId)
  }
  
  /**
   * Commission that'll be calculated based on clients last month deposit after recapitalizazion occurs.
   * @returns {Promise<void>}
   */
  async addExistingDepositCommission () {
    const movementId = '5fba3ec52a2eb021bba1059c'
    
    return CommissionModel.addExistingDepositCommission(movementId)
  }
  
  /**
   * Commission that occurs yearly, based on the previous clients deposit.
   * This will calculate 6% of the clients deposit and split in in 3 months, april, august, december
   * @returns {Promise<void>}
   */
  async addAnnualCommission () {
    return CommissionModel.addAnnualCommission()
  }
  
  /**
   * Once the month ends, the commissions must be reinvested and reset, but the real investment must
   * wait the 16th of the month.
   * So first we create a blockCommission movement and reset the commissions.
   * Thi movement will later be used to know what amount bust be reinvested.
   *
   * @returns {Promise<void>}
   */
  async blockCommissionsToReinvest () {
    return CommissionModel.blockCommissionsToReinvest('5fb13bb31466c51e1d036f3c')
  }
  
  /**
   * Search for the last COMMISSION_TO_REINVEST movement and add the amount of that movement
   * to the user's deposit, by generating a deposit movement.
   *
   * @returns {Promise<*>}
   */
  async reinvestCommissions () {
    return CommissionModel.reinvestCommissions('5fb13bb31466c51e1d036f3c')
  }
  
  /**
   * The user decides to collect a part of the current available commissions.
   *
   * @returns {Promise<*>}
   */
  async collectCommissions () {
    return CommissionModel.collectCommissions('5fb13bb31466c51e1d036f3c', 100)
  }
  
  async getStatus ({ params, auth }) {
    const userRole = auth.user.role
    let userId = auth.user._id
    
    let hasSubAgents = false
    
    if (auth.user.role === UserRoles.AGENTE) {
      hasSubAgents = (await auth.user.subAgents().fetch()).rows.length > 0
    }
    
    if (([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) || hasSubAgents) && params['id']) {
      userId = params['id']
    }
    
    /*
      Must return:
        - current month commissions
        - Reinvested commissions from the last block movement
        - Collected Commissions in the last month
        - Total amount of users new deposit for the last year
     */
    
    const result = await CommissionModel.getStatistics(userId)
    // const list = await CommissionModel.getAll(userId)
    
    return {
      blocks: result
      // list
    }
  }
  
  async getList ({ params, auth }) {
    let user = auth.user
    const userRole = user.role
    let userId = params.id || user._id.toString()
    let hasSubAgents = false
    
    // If is required data for a different user than the logged one
    // Must check permissions
    if (userId !== user._id.toString()) {
      if (!(await AclProvider.checkPermissions([CommissionsPermissions.COMMISSIONS_ALL_READ, CommissionsPermissions.COMMISSIONS_TEAM_READ], auth))) {
        throw new AclGenericException('Not enough permissions', AclGenericException.statusCodes.FORBIDDEN)
      }
      
      user = await UserModel.find(userId)
      
      // Dovrei fare un controllo se l'utente fa parte dei suoi agenti, altrimenti dovrei bloccare tutto
      /*if (user.role === UserRoles.AGENTE) {
        hasSubAgents = (await user.subAgents().count())
      }*/
    }
    
    return await CommissionModel.getAll(user._id)
  }
  
  async getAvailable ({ params, auth }) {
    const authUser = auth.user
    const authAdminUser = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(authUser.role)
    let userId = params.id
    
    // Dovrei controllare che l'authuser sia davvero un agente sopra l'agente a cui ci si riferisce
    
    return CommissionModel.getAvailableCommissions(userId)
  }
  
  async manualAdd ({ request, params, auth }) {
    const userId = params.id
    const currentUser = auth.user._id
    /**
     * @property {string} amountChange
     * @property {string} amountAvailable
     * @property {string} notes
     * @property {string} commissionType
     * @property {string} referenceAgent
     */
    const data = request.all()
    const adminUser = auth.user.role === UserRoles.ADMIN
    
    let directAdd = false
    
    if (data.commissionType === CommissionType.MANUAL_TRANSFER && !data.referenceAgent) {
      throw new AclGenericException('Not allowed without specifying the reference agent')
    }
    
    /*
      If the user has commissions.all:add, AND the request is made by an admin
      OR
      the user has COMMISSIONS_TEAM_ADD permission and the type is MANUAL_TRANSFER, so that the user is transfering
      its own commissions

      directly approve this transfer
     */
    if (await AclProvider.checkPermissions([CommissionsPermissions.COMMISSIONS_ALL_ADD], auth)
      || (await AclProvider.checkPermissions([CommissionsPermissions.COMMISSIONS_TEAM_ADD], auth)
        && data.commissionType === CommissionType.MANUAL_TRANSFER)) {
      
      directAdd = true
    }
    
    if (directAdd) {
      return CommissionModel.manualAdd({
        amountChange: data.amountChange,
        notes: data.notes,
        commissionType: data.commissionType,
        referenceAgent: castToObjectId(data.referenceAgent),
        refAgentAvailableAmount: data.referenceAgent ? (await CommissionModel.getAvailableCommissions(data.referenceAgent)) : 0,
        userId,
        created_by: currentUser
      })
    } else {
      const newRequest = await RequestModel.create({
        amount: data.amountChange,
        userId: currentUser,
        targetUserId: userId,
        type: RequestTypes.COMMISSION_MANUAL_ADD,
        commissionType: data.commissionType,
        referenceAgent: castToObjectId(data.referenceAgent),
        refAgentAvailableAmount: data.referenceAgent ? (await CommissionModel.getAvailableCommissions(data.referenceAgent)) : 0,
        wallet: WalletTypes.COMMISION,
        currency: CurrencyType.EURO,
        notes: data.notes
      })
      
      Event.emit('request::new', newRequest)
      
      return newRequest
    }
  }
  
  /**
   * Create a new movement of type COMMISSIONS_CANCELLATION
   * @return {Promise<void>}
   */
  async manualCancellation ({ request, params, auth }) {
    const userId = params.id
    const currentUser = auth.user._id
    /**
     * @property {string} amountChange
     * @property {string} amountAvailable
     * @property {string} notes
     * @property {string} commissionType
     * @property {string} referenceAgent
     */
    const data = request.all()
    const adminUser = auth.user.role === UserRoles.ADMIN
    
    if (!(await AclProvider.checkPermissions([CommissionsPermissions.COMMISSIONS_ALL_ADD], auth))) {
      throw new AclGenericException('Not enough permissions')
    }
    
    const availableAmount = await CommissionModel.getAvailableCommissions(userId)
    
    console.log(availableAmount)
    
    return CommissionModel.manualCancellation({
      amountChange: data.amountChange,
      availableAmount: availableAmount,
      notes: data.notes,
      commissionType: data.commissionType,
      referenceAgent: castToObjectId(data.referenceAgent),
      userId,
      created_by: currentUser
    })
  }
  
  /**
   * Function that allow to manually create any type of commission at any past date,
   * and automatically recalculate the next movements
   *
   * @param request
   * @param params
   * @param auth
   * @return {Promise<{}>}
   */
  async manualCreate ({ request, params, auth }) {
    const user = await UserModel.findOrFail(params.userId)
    const data = request.all()
    const lastCommission = await CommissionModel._getLastCommission(user._id, new Date(data.created_at))
    const toReturn = { updatedReinvestmentMovements: [], updatedMovements: [] }
    const calcResult = RequestModel.calcAgentBriteAmount(data.amountChange)
    
    /** @type {CommissionModel} */
    const newMovement = await CommissionModel._create({
      movementId: data.movementId ? castToObjectId(data.movementId) : null,
      userId: user._id,
      clientId: data.clientId ? castToObjectId(data.clientId) : null,
      commissionType: data.commissionType,
      dateReference: Date,
      amountChange: data.amountChange,
      commissionOnValue: data.commissionOnValue ? castToObjectId(data.commissionOnValue) : null,
      commissionPercentage: data.commissionPercentage ? castToObjectId(data.commissionPercentage) : null
    }, lastCommission)
    
    newMovement.created_at = new Date(data.created_at)
    
    if (data.commissionType === CommissionType.COMMISSIONS_COLLECTED) {
      newMovement.amountBrite = calcResult.amountBrite
      newMovement.amountEuro = calcResult.amountEuro
      newMovement.currency = calcResult.currency
      newMovement.briteConversionPercentage = calcResult.briteConversionPercentage
      
      const briteMovement = await AgentBrite.addBritesFromWithdraw(newMovement)
      
      toReturn.briteMovement = briteMovement
      
      newMovement.briteMovementId = briteMovement._id
    }
    
    await newMovement.save()
    
    try {
      // must update movements after the new one
      const movements = await CommissionModel.where({
        // the user is the same of the movement to delete
        'userId': user._id,
        'created_at': {
          $gt: newMovement.created_at
        }
      }).sort({ 'created_at': -1 }).fetch()
      
      for (let i = (movements.rows.length - 1); i >= 0; i--) {
        const movement = movements.rows[i]
        const isFirst = i === movements.rows.length - 1
        let isReinvestmentMovement = false
        
        if (movement._id.toString() === newMovement._id.toString()) {
          continue
        }
        
        movement.currMonthCommissionsOld = isFirst ? newMovement.currMonthCommissions : movements.rows[i + 1].currMonthCommissions
        movement.currMonthCommissions = movement.currMonthCommissionsOld
        
        if (CommissionType.COMMISSIONS_TO_REINVEST === movement.commissionType) {
          movement.amountChange = movement.currMonthCommissions
          
          toReturn.updatedReinvestmentMovements.push(movement)
          toReturn.alert = 'E\' stato cambiato un movimento di "Chiusura mese e reinvestimento", pertanto controllare che il nuovo importo corrisponda a quello assegnato nella lista dei movimenti'
          
          isReinvestmentMovement = true
        }
        
        CommissionModel.calculateCommission(movement)
        
        movement.save()
        toReturn.updatedMovements.push(movement)
        
        if (isReinvestmentMovement) {
          break
        }
      }
      
      toReturn.createdMovementCount = 1
      toReturn.briteMovementCount = toReturn.briteMovement ? 1 : 0
      toReturn.updatedMovementsCount = toReturn.updatedMovements.length
      toReturn.createdMovement = newMovement
      
      return toReturn
    } catch (e) {
      // in case of error delete the new movement
      await newMovement.delete()
      
      throw e
    }
  }
  
  async delete ({ params, auth }) {
    const refMovement = await CommissionModel.findOrFail(params.id)
    
    if (!(await AclProvider.checkPermissions([CommissionsPermissions.COMMISSIONS_ALL_ADD], auth))) {
      throw new MovementErrorException('You don\'t have the permission to delete this movement.')
    }
  
    if (CommissionType.COMMISSIONS_TO_REINVEST === refMovement.commissionType) {
      throw new MovementErrorException('You can\'t delete a reinvestment movement.')
    }
    
    // must update movements after the new one
    const movements = await CommissionModel.where({
      // the user is the same of the movement to delete
      'userId': castToObjectId(refMovement.userId),
      'created_at': {
        $gt: refMovement.created_at
      }
    }).sort({ 'created_at': -1 }).fetch()
    
    for (let i = (movements.rows.length - 1); i >= 0; i--) {
      const movement = movements.rows[i]
      const isFirst = i === movements.rows.length - 1
      let isReinvestmentMovement = false
      
      if (movement._id.toString() === refMovement._id.toString()) {
        continue
      }
      
      movement.currMonthCommissionsOld = isFirst ? refMovement.currMonthCommissionsOld : movements.rows[i + 1].currMonthCommissions
      movement.currMonthCommissions = movement.currMonthCommissionsOld
      
      if (CommissionType.COMMISSIONS_TO_REINVEST === movement.commissionType) {
        movement.amountChange = movement.currMonthCommissions
        
        isReinvestmentMovement = true
      }
      
      CommissionModel.calculateCommission(movement)
      
      movement.save()
      // toReturn.updatedMovements.push(movement)
      
      if (isReinvestmentMovement) {
        break
      }
    }
    
    refMovement.delete()
  }
}

module.exports = CommissionController
