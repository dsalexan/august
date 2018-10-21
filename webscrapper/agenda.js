// SCRAPPER QUE PEGA AS INFORMAÇÕES DA AGENDA UNIFESP
// obs: a saida ainda precisa ser formatada

var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

request("http://agendasjc.unifesp.br/class/Web/view-schedule.php", function(err, res, body){
  if (err) console.log("Erro: " + err);

  var $ = cheerio.load(body);

  $(".reservations tr").each(function(){
    var materia = $(this).find(".slots td").text().trim();

    // console.log(materia + sala + '\n');
    fs.appendFile("agenda.txt", materia + "\n");
  });
});
