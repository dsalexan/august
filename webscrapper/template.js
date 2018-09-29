//index.js
const rp = require('request-promise')
const cheerio = require('cheerio')

const options = {
  uri: 'http://globoesporte.globo.com/futebol/brasileirao-serie-a/',
  transform: function (body) {
    return cheerio.load(body)
  }
}

rp(options)
.then(($) => {
  $('.tabela-body-linha').each((i, item) => {
    console.log($(item).find('.tabela-times-time-nome').text())
  })
})
.catch((err) => {
  console.log(err);
})

/*
*  fonte http://www.luiztools.com.br/post/webscrapping-com-node-js/?gclid=EAIaIQobChMIsI7V9crC3QIViIaRCh1HawkgEAAYASAAEgIMg_D_BwE
*  #idDoElemento
*  .classeDoElemento
*  tagDoElemento
*  tag[atributo=valor]
*/