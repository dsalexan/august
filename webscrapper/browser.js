// SCRAPPER BASEADO EM HEADLESS BROWSER

const puppeteer = require('puppeteer');
const rp = require('request-promise');
const cheerio = require('cheerio');
const usuario = 'nome.do.usuario';
const senha = 'senha.intranet';
const ru = String('https://phpu.unifesp.br/ru_consulta/index.php');
const intranet = String ('https://intranet.unifesp.br/')
const op = parseInt(1);

async function getPic() { // screeshot da tela requisitada

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(ru);
  await page.keyboard.press('Tab');
  await page.keyboard.type(usuario); // insere usuário no campo
  await page.keyboard.press('Tab');
  await page.keyboard.type(senha); // insere senha no campo
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitFor(1000); // esperar 1000ms
  await page.screenshot({path: 'print.png'});

  await browser.close();// fecha o browser

}

getPic(); 