var promise = require('bluebird')
var options = {
    promiseLib: promise
}

var pgp = require('pg-promise')(options)
// ELEPHANTSQL_URL=postgres://postgres:AchillesDying@localhost:5432/echo
var conString = process.env.ELEPHANTSQL_URL || "postgres://postgres:AchillesDying@localhost:5432/echo";
// var conString = process.env.ELEPHANTSQL_URL || "postgres://postgres:AchillesDying@localhost:5432/echo";
var db = pgp(conString)

module.exports = db



// var client = new pg.Client(conString);
// client.connect(function(err) {
//   if(err) {
//     return console.error('could not connect to postgres', err);
//   }
//   client.query('SELECT * from aluno', function(err, result) {
//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log(result);
//     // >> output: 2018-08-23T14:02:57.117Z
//     client.end();
//   });
// });