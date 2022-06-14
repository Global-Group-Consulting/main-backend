const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')
const path = require('path')

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

/*
  "_id": {
    "$oid": "5fc95b694a594a00211ea9b1"
  },
  "nome": "Omar ",
  "cognome": "Pierotti ",
  "cellulare": "+39 3395974935",
  "email": "bioandbody@gmail.com",
  "indirizzo": "Via Rosengarten 19",
  "citta": "Lagundo",
  "prov": "bz"
 */

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'referenceAgent': {
        '$ne': null
      }
    }
  }, {
    '$addFields': {
      'firstName': {
        '$trim': {
          'input': '$firstName'
        }
      },
      'lastName': {
        '$trim': {
          'input': '$lastName'
        }
      }
    }
  }, {
    '$sort': {
      'lastName': 1,
      'firstName': 1
    }
  }, {
    '$lookup': {
      'from': 'users',
      'localField': 'referenceAgent',
      'foreignField': '_id',
      'as': 'agenteRiferimento'
    }
  }, {
    '$unwind': {
      'path': '$agenteRiferimento'
    }
  }, {
    '$addFields': {
      'agenteRiferimento.firstName': {
        '$trim': {
          'input': '$agenteRiferimento.firstName'
        }
      },
      'agenteRiferimento.lastName': {
        '$trim': {
          'input': '$agenteRiferimento.lastName'
        }
      }
    }
  }, {
    '$group': {
      '_id': '$agenteRiferimento',
      'numClienti': { $sum: 1 },
      'clienti': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$project': {
      '_id.legalRepresentativeProvince': 1,
      '_id.firstName': 1,
      '_id.lastName': 1,
      '_id.mobile': 1,
      '_id.email': 1,
      '_id.legalRepresentativeAddress': 1,
      '_id.legalRepresentativeCity': 1,
      'numClienti': 1,
      'clienti.legalRepresentativeProvince': 1,
      'clienti.firstName': 1,
      'clienti.lastName': 1,
      'clienti.mobile': 1,
      'clienti.email': 1,
      'clienti.legalRepresentativeAddress': 1,
      'clienti.legalRepresentativeCity': 1
    }
  }, {
    '$sort': {
      '_id.lastName': 1,
      '_id.firstName': 1
    }
  }
]

MongoClient.connect(
  'mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_production?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true',
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr)
    
    const collUsers = client.db('ggc_production').collection('users')
    const users = await collUsers.aggregate(agg).toArray()
    
    fs.writeFileSync(path.resolve(__dirname, './clientiPerAgente.json'), JSON.stringify(users, null, 2))
    
    client.close()
  })
