const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

MongoClient.connect(
  'mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_production?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true',
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr)
    
    const collRequests = client.db('ggc_production').collection('requests')
    const collMovements = client.db('ggc_production').collection('movements')
    
    const targetRequests = await collRequests.find({
      $and: [
        { notes: { $ne: null } },
        { notes: { $ne: 'Versamento iniziale' } }
      ]
    }).toArray()
    
    const movements = await collMovements.find({ _id: { $in: targetRequests.map(r => r.movementId) } }).toArray()
    
    movements.forEach((movement, i) => {
      const request = targetRequests.find(r => r.movementId && r.movementId.toString() === movement._id.toString())
      let notes = request.notes.trim()
      let movementId = request.movementId
      
      if (!movement.notes) {
        collMovements.updateOne({ _id: movementId }, { $set: { notes } })
          .then(() => console.log('OK:', movementId.toString()))
          .catch(err => {
            console.error('Failed movement: ', movementId.toString())
          })
      }
      
      if (i === movements.length - 1) {
        // client.close()
      }
    })
    
    // client.close()
  })
