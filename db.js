var promise = require('bluebird')
var options = {
    promiseLib: promise
}

var pgp = require('pg-promise')(options)
var conString = process.env.ELEPHANTSQL_URL || "postgres://postgres:5432@localhost/postgres";
var db = pgp(conString)

module.exports = db