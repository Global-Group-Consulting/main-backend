const MovementTypes = require('../../../enums/MovementTypes')
const moment = require('moment/moment')
const { castToObjectId } = require('../../Helpers/ModelFormatters')
const { start } = require('../../Filters/CalendarFilters.map')

/**
 *  il report deve contenere 3 tab
 *   - Riscossione provvigioni
 *     - dal 1 al 30 del mese precedente (quelle riscosse che non sono state bloccate il 1)
 *   - Riscossioni rendite classic
 *     - Riscossione degli interessi maturati dal 16 al 15
 *   - Riscossione rendite gold
 *     - Riscossione degli interessi maturati dal 16 al 15
 *     - Inserire sia gold che brite (aggiuhngere colonna che mostra uno o l'altro)
 *     - In fase di download, se una richiesta è classic, ma l'utente è gold, inserire quella richiesta nella pagina relativa ai gold.
 *
 *
 *   Il giorno 16, mandare agli admin un email che li invita a scaricare il report del mese con i versamenti da effettuare.
 *
 *
 *   Aggiungere le seguenti colonne:
 *   Importo
 *   Tipo richiesta (nome + gold o fisico)
 *   Nome Cognome
 *   IBAN
 *   BIC
 *   Note
 *   Agente riferimento
 *
 * @this {typeof Movement}
 * @param {{type: 'withdrawals' | 'commissions', startDate: string, endDate: string, movementType?: number, user?: User, referenceAgent?: User, clubPack?: any}} filters
 * @return {Promise<*>}
 */
module.exports.getReportsData = async function (filters) {
  const startDate = calcStartDate(filters)
  const endDate = calcEndDate(filters)
  const movementsToSearch = (filters.movementType)
    ? [filters.movementType]
    : [MovementTypes.DEPOSIT_COLLECTED, MovementTypes.CANCEL_DEPOSIT_COLLECTED, MovementTypes.INTEREST_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED]
  
  // quando l'utente richiede una tipologia, devo anche includere i movimenti di annullamento di quella tipologia.
  if (filters.movementType) {
    switch (filters.movementType) {
      case MovementTypes.DEPOSIT_COLLECTED:
        movementsToSearch.push(MovementTypes.CANCEL_DEPOSIT_COLLECTED)
        break
      case MovementTypes.INTEREST_COLLECTED:
        movementsToSearch.push(MovementTypes.CANCEL_INTEREST_COLLECTED)
        break
    }
  }
  
  const match = buildMatch(filters, movementsToSearch, startDate, endDate)
  const aggregation = buildAggregation(match, filters)
  
  /**
   * @type {{
   *          _id: string,
   *          users: any[]
   *        }[]}
   */
  const jsonData = await this.aggregateRaw(aggregation)
  const toReturn = {}
  
  // Must check cancelled movements
  const cancellationMovements = jsonData.filter(entry => [MovementTypes.CANCEL_DEPOSIT_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED].includes(entry._id.movementType))
  const normalMovements = jsonData.filter(entry => ![MovementTypes.CANCEL_DEPOSIT_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED].includes(entry._id.movementType))
  
  const toCancel = []
  
  // check the movements that have been cancelled
  for (const entry of cancellationMovements) {
    entry.movements.forEach(cancelMovement => {
      if (cancelMovement.cancelRef) {
        const cancelRef = cancelMovement.cancelRef.toString()
        
        toCancel.push(cancelRef)
      }
    })
  }
  
  // Remove the movements that has been cancelled
  normalMovements.map(entry => {
    entry.movements = entry.movements.filter((movement, i) => {
      const movementId = movement._id.toString()
      const mustReturn = !toCancel.includes(movementId)
      
      if (!mustReturn) {
        entry.amount -= movement.amountChange
      }
      
      return mustReturn
    })
    
    return entry
  })
  
  // Return only groups that has an amount greater than 0
  return normalMovements
    .filter(entry => entry.amount > 0)
    .filter(entry => {
      let mustReturn = true
      
      if (filters.amountRange) {
        const amountMin = filters.amountRange.min
        const amountMax = filters.amountRange.max
        
        const amountFilter = {
          min: true,
          max: true
        }
        
        if (amountMin) {
          amountFilter['min'] = entry.amount >= +amountMin
        }
        if (amountMax) {
          amountFilter['max'] = entry.amount <= +amountMax
        }
        
        mustReturn = amountFilter.min && amountFilter.max
      }
      
      return mustReturn
    })
}

function calcStartDate (filters) {
  const momentDate = moment()
  
  let startDate = moment(momentDate).subtract(1, 'months').set({
    date: filters.type === 'withdrawals' ? 16 : 1,
    hour: 0,
    minute: 0,
    second: 0
  })
  
  if (filters.startDate) {
    startDate = moment(filters.startDate)
  }
  
  return startDate
}

function calcEndDate (filters) {
  const momentDate = moment()
  
  let endDate = moment(momentDate).set({
    date: filters.type === 'withdrawals' ? 15 : 1,
    hour: 23,
    minute: 59,
    second: 59
  })
  
  if (filters.type === 'commissions') {
    endDate = endDate.subtract(1, 'days')
  }
  
  if (filters.endDate) {
    endDate = moment(filters.endDate)
  }
  
  return endDate
}

function buildMatch (filters, movementsToSearch, startDate, endDate) {
  const query = {
    movementType: { '$in': movementsToSearch },
    created_at: {
      $gte: startDate.toDate(),
      $lte: endDate.set({
        hour: 23,
        minute: 59,
        second: 59
      }).toDate()
    }
  }
  
  if (filters.user) {
    query.userId = castToObjectId(filters.user)
  }
  
  if (filters.referenceAgent) {
    query['user.referenceAgent'] = castToObjectId(filters.referenceAgent)
  }
  
  if (filters.clubPack) {
    if (filters.clubPack === 'unsubscribed') {
      query['$or'] = [
        {
          'user.clubPack': { '$eq': null }
        },
        {
          'user.clubPack': { '$exists': false }
        },
        {
          'user.clubPack': { '$eq': 'unsubscribed' }
        }
      ]
    } else {
      query['$and'] = [
        {
          'user.clubPack': { '$exists': true }
        }, {
          'user.clubPack': { '$ne': 'unsubscribed' }
        }
      ]
    }
  }
  
  return query
}

function buildAggregation (match, filters) {
  const joinUserWithRefAgent = [
    {
      '$lookup': {
        'from': 'users',
        'let': {
          'userId': '$userId'
        },
        'as': 'user',
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': ['$_id', '$$userId']
              }
            }
          },
          {
            '$addFields': {
              'id': '$_id'
            }
          },
          {
            '$project': {
              '_id': 0,
              'id': 1,
              'firstName': 1,
              'lastName': 1,
              'email': 1,
              'contractNumber': 1,
              'contractNotes': 1,
              'contractIban': 1,
              'referenceAgent': 1,
              'clubPack': 1,
              'gold': 1
            }
          },
          {
            '$lookup': {
              'from': 'users',
              'let': {
                'agentId': '$referenceAgent'
              },
              'as': 'referenceAgentData',
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$_id', '$$agentId'
                      ]
                    }
                  }
                },
                {
                  '$addFields': {
                    'id': '$_id'
                  }
                },
                {
                  '$project': {
                    'id': 1,
                    '_id': 0,
                    'firstName': 1,
                    'lastName': 1,
                    'email': 1
                  }
                }
              ]
            }
          },
          {
            '$unwind': {
              'path': '$referenceAgentData',
              'preserveNullAndEmptyArrays': true
            }
          }
        ]
      }
    },
    {
      '$unwind': {
        'path': '$user'
      }
    }
  ]
  const joinRequest = [
    {
      '$lookup': {
        'from': 'requests',
        'let': {
          'movementId': '$_id'
        },
        'as': 'request',
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': ['$movementId', '$$movementId']
              }
            }
          },
          {
            '$addFields': {
              'id': '$_id'
            }
          }
        ]
      }
    },
    {
      '$unwind': {
        'path': '$request',
        'preserveNullAndEmptyArrays': true
      }
    }
  ]
  
  return [
    {
      '$sort': {
        created_at: -1
      }
    },
    ...joinUserWithRefAgent,
    {
      '$match': match
    },
    ...joinRequest,
    {
      '$group': {
        '_id': {
          'user': '$userId',
          'requestType': '$request.type',
          'movementType': '$movementType'
        },
        'movements': {
          '$push': '$$ROOT'
        },
        'amount': {
          '$sum': '$amountChange'
        },
        user: {
          $addToSet: '$user'
        },
        reqNotes: {
          $push: '$request.notes'
        }
      }
    },
    {
      '$unwind': {
        'path': '$user'
      }
    },
    {
      '$addFields': {
        'created_at': {
          '$arrayElemAt': ['$movements.created_at', 0]
        }
      }
    },
    {
      '$addFields': {
        'type': filters.type
      }
    },
    {
      '$sort': {
        'user.lastName': 1,
        'user.firstName': 1,
        '_id.requestType': 1
      }
    }
  ]
}
