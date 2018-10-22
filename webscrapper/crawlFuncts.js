// EXEMPLO PARA WEB CRAWLER


var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var START_URL = 'https://www1.folha.uol.com.br/poder/2018/10/suplicy-oscila-a-25-e-mara-gabrilli-alcanca-21-ao-senado-em-sp.shtml' // url inicial
var SEARCH_WORD = 'Eliana Ferreira' // palavra a ser buscada;
var MAX_PAGES_TO_VISIT = 50;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {  // metodo que realiza o webcrawling
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // caso a proxima pagina ja tenha sido visitada
    crawl();
  } else {
    // vai para a próxima página da lista pagesToVisit
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // adiciona uma pagina para o array
  pagesVisited[url] = true;
  numPagesVisited++;

  // faz uma requisição para a página a ser visitada
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     // confere o log 200 OK do HTTP
     console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // webscrapping com a palavra a ser buscada
     var $ = cheerio.load(body);
     var isWordFound = searchForWord($, SEARCH_WORD);
    
     if(isWordFound) {
       console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
     } else {
       collectInternalLinks($);
       // callback() no caso desse programa chama o método crawl()
       callback();
     }
  });
}

function searchForWord($, word) { // método para procurar palavras na página
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) { // procura todos os links na página
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}