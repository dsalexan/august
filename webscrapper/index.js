//index.js
const rp = require('request-promise')
const cheerio = require('cheerio')
var nome = String('teste')
const options = {
  uri: 'http://www.sport-histoire.fr/pt/Geografia/Paises_por_ordem_alfabetica.php',
  transform: function (body) {
    return cheerio.load(body)
  }
}

rp(options)
.then(($) => {
  $('.tableau_gris_centrer').each((i, item) => {
    let texto = $(item).find('a').text() + ' '
    console.log(texto)
  })
})
.catch((err) => {
  console.log(err)
})

  //fonte http://www.luiztools.com.br/post/webscrapping-com-node-js/?gclid=EAIaIQobChMIsI7V9crC3QIViIaRCh1HawkgEAAYASAAEgIMg_D_BwE
  