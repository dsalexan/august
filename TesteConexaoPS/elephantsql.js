var pg = require("pg");
// or native libpq bindings
// var pg = require('pg').native

// var conString = "Server=localhost;Database=echo;User Id=usuario;Password=AchillesDying;Port=5432" //Can be found in the Details page
var conString = "postgres://usuario:AchillesDying@localhost:5432/echo";
var client = new pg.Client(conString);
client.connect(function(err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query("SELECT * from aluno", function(err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0].nome);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});
