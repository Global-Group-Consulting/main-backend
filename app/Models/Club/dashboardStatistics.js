const BriteMovementTypes = require('../../../enums/BriteMovementTypes')

/**
 * @typedef {{
 * total: number,
 * _id: { semesterId: string, movementType: string},
 * usableFrom: string,
 * expiresAt: string,
 * data: any[] }} DashboardStatisticsGroup
 */

/**
 * @typedef {{
 *    expiresAt: string,
 *    usableFrom: string,
 *    types: Record<string, number>,
 *    total: number,
 *    totalUsed: number,
 *    totalAvailable: number
 * }} DashboardStatistic
 */

/**
 * @this import('../Brite')
 * @return {Promise<Record<string, DashboardStatistic>>}
 */
module.exports = async function () {
  const sumMovements = [BriteMovementTypes.DEPOSIT_ADDED, BriteMovementTypes.INTEREST_RECAPITALIZED]
  const aggregationQuery = [
    {
      '$group': {
        '_id': {
          'semesterId': '$semesterId',
          'movementType': '$movementType'
        },
        'data': {
          '$push': '$$ROOT'
        },
        'total': {
          '$sum': '$amountChange'
        },
        'usableFrom': {
          '$addToSet': "$usableFrom"
        },
        'expiresAt': {
          '$addToSet': "$expiresAt"
        }
      }
    }, {
      '$unwind': {
        'path': '$usableFrom',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$expiresAt',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$sort': {
        '_id.semesterId': 1,
        '_id.movementType': 1
      }
    }
  ]

  /**
   * @type {DashboardStatisticsGroup}
   */
  const data = await this.db.collection("brite_models")
    .aggregate(aggregationQuery)
    .toArray()

  /**
   * @type {Record<string, DashboardStatistic>}
   */
  const toReturn = {}

  // For each entry in the aggregation result,
  // make another group and creates the final data to return.
  // The result must contain the totals for each semester, so all the calculation based on the
  // movements type is made inside the for loop.

  for (/** @type {DashboardStatisticsGroup} */ let entry of data) {
    const semesterId = entry._id.semesterId;
    const movementType = entry._id.movementType;

    if (!toReturn.hasOwnProperty(semesterId)) {
      toReturn[semesterId] = {
        expiresAt: entry.expiresAt,
        usableFrom: entry.usableFrom,
        // List of all movements types with their own totals
        types: {},

        // Totals calculated for the current semester
        total: 0,
        totalUsed: 0,
        totalAvailable: 0
      }
    }

    if (!toReturn[semesterId].types.hasOwnProperty(movementType)) {
      toReturn[semesterId].types[movementType] = 0
    }

    toReturn[semesterId].types[movementType] += entry.total

    // Based on the movement type, decide where and what type of calculation must be made.
    if (sumMovements.includes(movementType)) {
      toReturn[semesterId].total += entry.total
      toReturn[semesterId].totalAvailable += entry.total
    } else {
      toReturn[semesterId].totalUsed += entry.total
      toReturn[semesterId].totalAvailable -= entry.total
    }
  }

  return toReturn;
}
