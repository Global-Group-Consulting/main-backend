
module.exports = [
  {
    '$match': {
      'movementType': 'interest_recapitalized',
      'createdAt': {
        '$gte': new Date('Mon, 16 May 2022 00:00:31 GMT')
      }
    }
  }, {
    '$sort': {
      'createdAt': 1
    }
  }, {
    '$group': {
      '_id': '$userId',
      'movements': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$addFields': {
      'counter': {
        '$size': '$movements'
      }
    }
  }, {
    '$match': {
      'counter': {
        '$gte': 2
      }
    }
  }
]
