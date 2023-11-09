const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')
const Db = require('mongodb').Db


/**
 * @param {string} dbName
 * @return {Promise<Db>}
 */
function connect (dbName) {
    dotenv.config()
    
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DB_PROD_CONNECTION_STRING,
            { useNewUrlParser: true, useUnifiedTopology: true },
            function (connectErr, client) {
                if (connectErr) {
                    return reject(connectErr)
                }
                
                resolve(client.db(dbName))
            })
    })
}

module.exports.connect = connect
