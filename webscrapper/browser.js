// SCRAPPER BASEADO EM HEADLESS BROWSER
var fs = require('fs');
const puppeteer = require('puppeteer');
const rp = require('request-promise');
const cheerio = require('cheerio');

const usuario = 'usuario';
const senha = 'senha.intranet';
const ru = String('https://phpu.unifesp.br/ru_consulta/index.php');
const intranet = String ('https://intranet.unifesp.br/');
const historico = String ('https://www3.unifesp.br/prograd/app_prograd/he_novo/he_novo_blank_inicial/he_novo_blank_inicial.php?SID=fd0951e41ca63dc625082027e912ed9a&INapli=');
const op = parseInt(1);

async function getPic() { // screeshot da tela requisitada

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(intranet);
  await page.keyboard.press('Tab');
  await page.keyboard.type(usuario); // insere usuário no campo
  await page.keyboard.press('Tab');
  await page.keyboard.type(senha); // insere senha no campo
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.mouse.move(200,330);
  await page.waitFor(500); // esperar 500ms
  await page.goto(historico);
  await page.waitFor(500);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitFor(500);

  let content = await page.content();
  var $ = cheerio.load(content); // pega o corpo do html da página7
  $('.scGridTabela tr').each(function(){
    var materia = $(this).find('#id_sc_field_unidade_1').text().trim();
    fs.appendFile('content/elementos.txt',materia + '\n');
  });

  await browser.close();// fecha o browser
}

getPic(); 