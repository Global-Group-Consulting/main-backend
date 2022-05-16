const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_production?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&ssl=true'

// Create a new MongoClient
const client = new MongoClient(uri)

const aggregation = require('./queries/getUsersWithWrongRecapitalization')

async function run () {
  try {
    // Connect the client to the server
    await client.connect()
    
    // Establish and verify connection
    await client.db('admin').command({ ping: 1 })
    console.log('Connected successfully to server')
    
    const coll = await client.db('ggc_production').collection('movements')
    
    const aggCursor = coll.aggregate(aggregation)
  
    /**
     *
     * @type {{userId: string, movements: string[]}[]}
     */
    const movements = []
    
    for await (const doc of aggCursor) {
      /**
       * @type {any[]}
       */
      const totalMovements = doc.movements
  
      const print = {
        userId: doc._id,
        movements: totalMovements.slice(1).map(m => m._id)
      }
      
      movements.push(print)
    }
    
    // console.log(movements)
    
    const toDeleteQuery = {
      $or: movements.map(m => ({ _id: { $in: m.movements } }))
    }
  
    // removes movements
    const deleteManyResult = await coll.deleteMany(toDeleteQuery);
    console.dir(deleteManyResult.deletedCount);
  
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

run().catch(console.dir)
