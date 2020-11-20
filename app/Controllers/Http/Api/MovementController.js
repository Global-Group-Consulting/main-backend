'use strict'

/** @typedef {import('../../../../@types/Movement.d').IMovement} IMovement*/

const MovementModel = use("App/Models/Movement")
const MovementTypes = require("../../../../enums/MovementTypes")
const UserRoles = require('../../../../enums/UserRoles')
const MovementErrorException = require('../../../Exceptions/MovementErrorException')
const MovementError = require("../../../Exceptions/MovementErrorException")

class MovementController {

  async read({ auth, params }) {
    const userRole = +auth.user.role
    const forId = params["id"]
    let userId = auth.user.id

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) && forId) {
      userId = forId
    }

    return await MovementModel.getAll(userId)
  }

  async add({ request, response }) {
    /**
     * @type {import("../../../../@types/Movement.d").AddMovementDto}
     */
    const data = request.all()

    const newMovement = await MovementModel.create(data)

    return newMovement
  }

  async cancel({ request, params, response }) {
    const reason = request.input("reason")
    const movementId = params["id"]

    /**
     * @type {IMovement}
     */
    const movementRef = await MovementModel.find(movementId)

    if (!movementRef) {
      throw new MovementError("Movement not found.")
    }

    const movementCancelRef = await MovementModel.where({ cancelRef: movementRef._id }).first()

    if (movementCancelRef) {
      throw new MovementError("Movement already canceled.")
    }

    const movementType = MovementTypes.get(movementRef.movementType).cancel
    const jsonData = movementRef.toJSON()

    if (!movementType) {
      throw new MovementError("Can't cancel this type of movement.")
    }

    delete jsonData._id

    const newMovement = await MovementModel.create({
      ...jsonData,
      movementType,
      depositOld: jsonData.deposit,
      cancelRef: movementId,
      cancelReason: reason
    })

    return newMovement
  }

  /**
   * 
   * @param {{auth: {user: {id: string}}}} param0 
   * @returns {{deposit:number, interestAmount:number, interestPercentage:number}}
   */
  async currentStatus({ auth }) {
    const userId = auth.user.id

    /** @type {IMovement} */
    const result = await MovementModel.getLast(userId)

    if (!result) {
      throw new MovementErrorException("No movement found for the current user.")
    }

    return {
      deposit: result.deposit,
      interestAmount: result.interestAmount,
      interestPercentage: result.interestPercentage
    }
  }
}

module.exports = MovementController
