const { DateTime } = require('luxon')
const cheerio = require('cheerio')
const fs = require('fs');
const G = require('generatorics');

const MENU_UNIFESP_SELECTOR = '#menuPrivado li:nth-of-type(2) a'
const UNIFESP_ATESTADO_SELECTOR = '#tbCorpoVisual tr:nth-of-type(15) td:nth-of-type(5) a'
const IFRAME_CONSULTA_SELECTOR = '#iframe iframe'

const PARAGRAPH_ATESTADO_SELECTOR = '#content p'
const LINK_ATESTADO_SELECTOR = '#content p a'

const CONTENT_ATESTADO_SELECTOR = '#content p.texto:nth-of-type(3)'

var read_atestado = function(browser, page, options){
    return new Promise(async resolve => {
        // clicar em Menu>Unifesp
        await page.waitForSelector(MENU_UNIFESP_SELECTOR)
        await page.click(MENU_UNIFESP_SELECTOR)

        // clicar em Atestado de Matrícula On Line (Visualizar no Google Chrome ou IE)
        await page.waitForSelector(UNIFESP_ATESTADO_SELECTOR)
        await page.click(UNIFESP_ATESTADO_SELECTOR)

        // segue o link no iframe
        await page.waitForSelector(IFRAME_CONSULTA_SELECTOR)
        let $  = cheerio.load(await page.content())
        let iframe = $(IFRAME_CONSULTA_SELECTOR).attr('src')
        await page.goto(iframe)

        await page.waitForSelector(PARAGRAPH_ATESTADO_SELECTOR)
        $ = cheerio.load(await page.content())
        let date = $(PARAGRAPH_ATESTADO_SELECTOR)
            .text()
            .trim()
            .replace(/(\t)+/g, ' ')
            .replace('\n', ' ')
            .split(' ')
            .map(word => DateTime.fromFormat(word, 'dd/MM/yyyy', {locale: 'pr-br'}))
            .filter(dt => dt.isValid)[0]

        await page.click(LINK_ATESTADO_SELECTOR)

        await page.waitForSelector(CONTENT_ATESTADO_SELECTOR)

        let bodyHTML = await page.evaluate(() => document.body.innerHTML)

        fs.writeFileSync('atestado.html', bodyHTML)

        resolve({
            html: bodyHTML,
            date: date == undefined ? DateTime.utc().plus({days: 30}).toString() : date.setZone('utc').toString()
        })
    })
}

var compile_atestado = function(html){
    return new Promise(async resolve => {
        const $ = cheerio.load(html)
        
        let paragraph = $(CONTENT_ATESTADO_SELECTOR)
            .text()
            .trim()
            .replace(/(\t)+/g, ' ')
            .replace(/(\n)+/g, ' ')
            .replace(/(,)+/g, ' ')
            .replace(/(-)+/g, ' ')
            .replace(/(\.)+/g, ' ')
            .replace(/(   )/g, ' ')
            .replace(/(  )/g, ' ')
            .split(' ')

        let size = 5
        let perm = []
        for(let i = 0; i <= paragraph.length - size; i++){
            perm.push(paragraph.slice(i, i + size).join(' '))
        }
        perm = perm.map(t => [t, DateTime.fromString(t, "dd 'de' MMMM 'de' yyyy", {locale:'pt-BR'})]) //.filter(dt => dt.isValid)
        let para  = true

        resolve()
    })
}

var save_atestado = function(data){
    return new Promise(async resolve => {
        // TODO: implementar salvar atestado
        console.log('save atestado')
        resolve(true)
    })
}


var fetch_atestado = function(browser, page, options){
    return new Promise(async resolve => {
        let browserPersistence = {}

        let atestado = await read_atestado(browser, page)
        options.puppeteerObject && options.puppeteerObject.destroy(options, browserPersistence)
        
        await compile_atestado(atestado.html)
        browserPersistence.puppeteer && (atestado.puppeteer = browserPersistence.puppeteer)

        await save_atestado(atestado)

        resolve(atestado)
    })
}

module.exports = {
    fetch: fetch_atestado,
    read: read_atestado,
    compile: compile_atestado,
    save: save_atestado
}