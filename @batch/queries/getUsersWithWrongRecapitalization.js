
module.exports = [
  {
    '$match': {
      'movementType': 3,
      'created_at': {
        '$gte': new Date('Mon, 16 May 2022 00:00:31 GMT')
      }
    }
  }, {
    '$sort': {
      'created_at': 1
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
/*
MongoClient.connect(
  'mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_production?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&ssl=true',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (connectErr, client) {
    // assert.equal(null, connectErr);
    
      const coll = client.db('ggc_production').collection('movements')
      
    coll.aggregate(agg)
      .then(function (result) {
        console.log(result)
        client.close()
      })
    
  })*/
