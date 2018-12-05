const { DateTime } = require('luxon')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
var pdf = require('html-pdf')
const G = require('generatorics')

const Alunos = require('../../models/Alunos')

var INTRANET_UNIFESP_URL = 'https://intranet.unifesp.br/'

const MENU_UNIFESP_SELECTOR = '#menuPrivado li:nth-of-type(2) a'
const UNIFESP_ATESTADO_SELECTOR = '#tbCorpoVisual tr:nth-of-type(15) td:nth-of-type(5) a'
const IFRAME_CONSULTA_SELECTOR = '#iframe iframe'

const PARAGRAPH_ATESTADO_SELECTOR = '#content p'
const LINK_ATESTADO_SELECTOR = '#content p a'

const CONTENT_ATESTADO_SELECTOR = '#content p.texto:nth-of-type(3)'
const TABLE_ATESTADO_SELECTOR = '#content table tr'
const TABLE_ATESTADO_TRANSLATE = {
    'CÓDIGO': 'código',
    'LISTA DE UNIDADES CURRICULARES MATRICULADO': 'uc',
    'TURNO': 'turno',
    'DIA': 'dia',
    'INÍCIO': 'inicio',
    'TÉRMINO': 'termino',
}
const TIMES_ATESTADO_TRANSLATE = {
    '8H': '08h00',
    '10H': '10h00',
    '13.3H': '13h30',
    '15.3H': '15h30',
    '19H': '19h00',
    '21H': '21h00'
}

const PARAGRAPH2_ATESTADO_SELECTOR = 'div.hash p:nth-of-type(1)'

var delay = function(_time){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, _time)
    })
}

var read_atestado = function(browser, page, ra_aluno, options){
    return new Promise(async resolve => {
        await page.goto(INTRANET_UNIFESP_URL, {waitUntil: 'networkidle2'})

        try{
            await page.$eval(MENU_UNIFESP_SELECTOR)
            await page.click(MENU_UNIFESP_SELECTOR, {waitUntil: 'domcontentloaded'})
        }catch(err){
            await delay(2000)
            await page.evaluate('toggleMenu()');
            await page.waitForSelector(MENU_UNIFESP_SELECTOR)            
            await page.click(MENU_UNIFESP_SELECTOR, {waitUntil: 'domcontentloaded'})
        }

        // clicar em Atestado de Matrícula On Line (Visualizar no Google Chrome ou IE)
        // await page.waitForSelector(UNIFESP_ATESTADO_SELECTOR)
        await page.evaluate('mostraAplicativo("886")')
        // await page.click(UNIFESP_ATESTADO_SELECTOR, {waitUntil: 'domcontentloaded'})

        // segue o link no iframe
        await page.waitForSelector(IFRAME_CONSULTA_SELECTOR)
        let $  = cheerio.load(await page.content())
        let iframe = $(IFRAME_CONSULTA_SELECTOR).attr('src')
        await page.goto(iframe, {waitUntil: 'domcontentloaded'})

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

        await page.click(LINK_ATESTADO_SELECTOR, {waitUntil: 'domcontentloaded'})

        await page.waitForSelector(CONTENT_ATESTADO_SELECTOR)

        let bodyHTML = await page.evaluate(() => document.body.innerHTML)

        fs.writeFileSync('atestado.html', bodyHTML)
        
        var html = fs.readFileSync('atestado.html', 'utf8');
        var options = { format: 'Letter' };
        
        pdf.create(html, options).toFile(path.join(global.root_path, 'res/atestados/' + ra_aluno + '.pdf'), function(err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/res/atestados/111866.pdf' }
        });

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
            .replace(/( {3})/g, ' ')
            .replace(/( {2})/g, ' ')
            .split(' ')

        let size = 5
        let perm = []
        for(let i = 0; i <= paragraph.length - size; i++){
            perm.push(paragraph.slice(i, i + size).join(' '))
        }
        perm = perm.map(t => DateTime.fromString(t, "dd 'de' MMMM 'de' yyyy", {locale:'pt-BR'})).filter(dt => dt.isValid)
        
        let header = []
        let body = []
        $(TABLE_ATESTADO_SELECTOR).each(function(i, tr){
            if(i == 0){
                header = $(tr).find('th').toArray().map(th => $(th).text())
            }else{
                let data = {}
                let entry = $(tr).find('td').toArray().map(th => $(th).text())
                for(let j = 0; j < entry.length; j++){
                    let info = entry[j]
                    let key = TABLE_ATESTADO_TRANSLATE[header[j]]

                    if(key == 'inicio' || key == 'termino'){
                        info = TIMES_ATESTADO_TRANSLATE[info]
                    }else if(key == 'dia'){
                        info = info.toLowerCase()
                    }

                    data[key] = info
                }
                body.push(data)
            }
        })

        let paragraph2 = $(PARAGRAPH2_ATESTADO_SELECTOR)
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

        size = 2
        validade = []
        for(let i = 0; i <= paragraph2.length - size; i++){
            validade.push(paragraph2.slice(i, i + size).join(' '))
        }
        validade = validade.map(t => DateTime.fromString(t, "dd/MM/yyyy hh:mm:ss")).filter(dt => dt.isValid)[0]
        validade = validade.plus({days: 30})

        // TODO: store as UTC
        resolve({
            expiration: validade.toString(),
            semester: {
                start: perm.length > 0 && perm[0].toString(),
                end: perm.length > 0 && perm[1].toString()
            },
            classes: body
        })
    })
}

var save_atestado = function(data, ra_aluno){
    return Alunos.insert_atestado(data, DateTime.toSQL(), ra_aluno)
}


var fetch_atestado = function(browser, page, ra_aluno, options={}){
    return new Promise(async resolve => {
        let browserPersistence = {}
        let atestado

        try{
            atestado = await read_atestado(browser, page, ra_aluno)
            options && options.puppeteerObject && options.puppeteerObject.destroy(options, browserPersistence)
            
            let compilado = await compile_atestado(atestado.html)

            atestado = {
                date: atestado.date,
                ...compilado
            }
        }catch(error){
            atestado = {error}
        }
        
        atestado = await save_atestado(atestado, ra_aluno)
        
        browserPersistence.puppeteer && (atestado.puppeteer = browserPersistence.puppeteer)

        resolve(atestado)
    })
}

module.exports = {
    fetch: fetch_atestado,
    read: read_atestado,
    compile: compile_atestado,
    save: save_atestado
}