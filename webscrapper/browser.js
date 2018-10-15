// SCRAPPER BASEADO EM HEADLESS BROWSER
var fs = require('fs');
const puppeteer = require('puppeteer');
const rp = require('request-promise');
const cheerio = require('cheerio');

const usuario = 'usuario';
const senha = 'senha';
const ru = String('https://phpu.unifesp.br/ru_consulta/index.php');
const intranet = String ('https://intranet.unifesp.br/');
const historico = String ('https://www3.unifesp.br/prograd/app_prograd/he_novo/he_novo_blank_inicial/he_novo_blank_inicial.php?SID=fd0951e41ca63dc625082027e912ed9a&INapli=');
const atestado = String ('https://www3.unifesp.br/prograd/app/atestados?SID=dd4f5be9a9614483f802422e739d9593&INapli=');
const op = parseInt(1);

async function main() {

  try{
    const browser = await puppeteer.launch({headless: true});
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
    // pega informacoes do historico
    try{
      const content = page.$$('.scGridFieldEven');
      //console.log(content.length);
      
    }catch(e){
      console.log('Erro em historico! ' + e);
    }

    await page.goto(atestado);
    await page.waitFor(500);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitFor(1000);
    // pega informacoes o atestado
    /*
    try{
      const table = await page.$$('tr');
      var x = table.getElementsByTagName('th')
      console.log(x[0]);
  
    }
    catch(e){
      console.log('Erro em Atestado! ' + e);
    }*/

    await browser.close();// fecha o browser
  }catch(e){
    console.log('Erro na Main! ' + e);
  }
}

main();