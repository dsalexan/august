var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

request('http://imdb.com/chart/moviemeter', function(err, res, body) { // faz a requisicao http
  if (err) console.log('ERRO! ' + err)

  var $ = cheerio.load(body)
  $('.lister-list tr').each(function(){ // corpo da tabela
    var titulo = $(this).find('.titleColumn a').text().trim() // procura nome dos filmes na tag <a class=title-colunm>..</a>
    var nota = $(this).find('.imdbRating strong').text().trim() // procura nota dos filmes na tag <strong class=imdb-rating>..</strong>

    // console.log(titulo + ' ') //imprime resultado

    fs.appendFile('imdb.txt', titulo + ' ' + nota + '\n') // salva informacoes no arquivo imdb.txt

  })
})
