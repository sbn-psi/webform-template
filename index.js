// external modules
const assert = require('assert')
const {ObjectId} = require('mongodb')
const {isAfter, isISO8601} = require('validator')

// internal modules
const db = require('./db.js')
const mailer = require('./email.js')

// express setup
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('static'))
app.listen(4001)
console.log('running on port 4001...')


app.get('/fetchAll', function(req, res) {
    db.connect(async function(dbConnection, complete) {
        const result = await db.find(dbConnection, {})
        complete()
        res.status(200).send(result)
    })
})

app.get('/fetch', function(req, res) {
    let dateQuery = req.query.startDate
    try {
        assert(dateQuery, "Expected startDate parameter")
        assert(isISO8601(dateQuery), "Improperly formed startDate: " + dateQuery)
    } catch (err) {
        res.status(400).send(err.message)
        return
    }

    db.connect(async function(dbConnection, complete) {
        const result = await db.find(dbConnection, {"startDate" : { $lte : new Date(dateQuery) }})
        complete()
        res.status(200).send(result)
    })
})

app.post('/add', function(req, res) {
    // ensure input
    try {
        assert(req.body, "Failed to parse request")
        assert(req.body.name, "Name was not provided")
        assert(req.body.version, "Version was not provided")
        assert(req.body.startDate, "Start Date was not provided")

        assert(isISO8601(req.body.startDate), "Improperly formed date: " + req.body.startDate)
    } catch (err) {
        res.status(400).send(err.message)
        return
    }

    // pull fields out of request for db insert
    const { name, version, startDate } = req.body
    let record = { name, version, startDate: new Date(startDate) }
    record._timestamp = new Date()

    // insert and return
    db.connect(async function(dbConnection, complete) {
        const result = await db.insert(record, dbConnection)
        complete()
        let newRecord = result.ops[0]
        res.status(201).send( newRecord )
        mailer.confirm(newRecord)
    })

})

app.post('/delete', function(req, res) {
    let id = null;
    try {
        assert(req.body, "Failed to parse request");
        assert(req.body.id, "Module ID was not provided");
        id = new ObjectId(req.body.id);
    } catch (err) {
        res.status(400).send(err.message);
        return
    }

    db.connect(async function(dbConnection, complete) {
        let result = await db.deleteOne(dbConnection, id)
        complete();
        res.status(204).send();
    });
});