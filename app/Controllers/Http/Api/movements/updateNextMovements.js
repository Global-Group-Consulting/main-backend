const MovementTypes = require("../../../../../enums/MovementTypes");
const {upperFirst: _upperFirst, camelCase: _camelCase} = require("lodash");
const {toJSON} = require("lodash/seq");
/** @type {typeof import('../../../Models/Movement')} */
const MovementModel = use('App/Models/Movement')

/**
 * Given a movement, update the next movements details
 *
 * @param movementRef
 * @param {boolean} [isDeleting=false]
 * @return {Promise<void>}
 * @private
 */
module.exports = async (movementRef, isDeleting = false) => {
    // Recuperare tutti i movimenti successivi a quello da cancellare più quello precedente che diventerà il movimento di partenza
    const movements = await MovementModel.where({
        // the user is the same of the movement to delete
        'userId': movementRef.userId,
        'created_at': {
            $gt: movementRef.created_at
        }
    }).sort({'created_at': -1}).fetch()

    if (isDeleting) {
        movementRef.deposit = movementRef.depositOld
        movementRef.interestAmount = movementRef.interestAmountOld
    }

    const toReturn = []
    const promises = []

    for (let i = movements.rows.length - 1; i >= 0; i--) {
        const movement = movements.rows[i]
        const isFirst = i === movements.rows.length - 1
        const movementTypeId = MovementTypes.get(movement.movementType).id
        const lastMovement = isFirst ? movementRef : movements.rows[i + 1]

        if (movementRef._id.toString() === movement._id.toString()) {
            continue
        }

        movement.depositOld = isFirst ? lastMovement.depositOld : lastMovement.deposit
        movement.interestAmountOld = isFirst ? lastMovement.interestAmountOld : lastMovement.interestAmount

        promises.push(async () => {
            try {
                // use original methods for calculating deposit and interest
                await MovementModel[`_handle${_upperFirst(_camelCase(movementTypeId))}`](movement, lastMovement, true)

                const updatedBy = movementRef.history && movementRef.history.length > 0 ? (movementRef.history[movementRef.history.length - 1].updatedBy) : null

                movement.appendToHistory(updatedBy, {
                    deposit: {
                        old: movement.depositOld,
                        new: movement.deposit
                    },
                    interestAmount: {
                        old: movement.interestAmountOld,
                        new: movement.interestAmount
                    },
                })

                await movement.save()

                toReturn.push(movement.toJSON())
            } catch (e) {
                await Promise.reject({
                    movement,
                    error: e
                })
            }
        })
    }

    await Promise.all(promises.map(_fn => _fn()))

    return toReturn
}
