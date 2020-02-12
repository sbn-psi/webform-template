const url = 'mongodb://localhost:27017'
const name = 'app'
const assert = require('assert')


const {MongoClient} = require('mongodb')

const moduleCollection = 'modules'
module.exports = {
    connect: async function(callback) {
        // Use connect method to connect to the server
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        console.log("Connected successfully to database server");
    
        const db = client.db(name);
    
        await callback(db, function() {
            client.close();
            console.log("Closed database connection");
        })
    },
    insert: async function(document, db) {
        const collection = db.collection(moduleCollection)
        document._isActive = true;
        const result = await collection.insertOne(document)
        assert.equal(1, result.result.n)
        assert.equal(1, result.ops.length)
        return result
    },
    find: async function(db, inputFilter) {
        const collection = db.collection(moduleCollection)
        let activeFilter = { _isActive: true }
        Object.assign(activeFilter, inputFilter)
        const docs = await collection.find(activeFilter).toArray()
        return docs
    },
    deleteOne: async function(db, id) {
        const collection = db.collection(moduleCollection);
        // do a soft delete
        const result = await collection.updateOne({ '_id': id }, { $set: { _isActive: false }});
        return result;
    }
}