const { DateTime } = require('luxon')
const cheerio = require('cheerio')
const fs = require('fs')

const MENU_UNIFESP_SELECTOR = '#menuPrivado li:nth-of-type(2) a'
const UNIFESP_HISTORICO_SELECTOR = '#tbCorpoVisual tr:nth-of-type(15) td:nth-of-type(6) a'
const IFRAME_CONSULTA_SELECTOR = '#iframe iframe'
const LINK_CONSULTA_SELECTOR = 'a.scGridFieldOddLink'

const TD_HEADER_TRANSLATION = {
    'Coefic. Rendimento': 'cr',
    'Curso': 'curso',
    'Ano de Ingresso': 'ingresso',
    'Matrícula': 'ra',
    'Nome': 'nome',
    'Situação Acadêmica atual':	'situacao'
}

const TD_HEADER1_SELECTOR = 'td.scGridHeaderFont[align="right"]'
const TD_HEADER1_EXCLUDES = [1]

const TD_HEADER2_SELECTOR = 'td.scGridBlock'

const TR_BODY_HEADER_SELECTOR = 'tr.scGridLabel'
const TR_BODY_HEADER_TRANSLATION = {
    'Ano Letivo': 'ano',
    'Sem': 'semestre',
    'Série / Termo': 'termo',
    'Turno': 'turno',
    'Código - Unidade Curricular': 'uc',
    'Grupo': 'grupo',
    'Faltas': 'faltas',
    'Freq.%': 'frequencia',
    'Créd.': 'creditos',
    'Carga Horária': 'horas',
    'Conceito': 'conceito',
    'Situação': 'situacao'
}
const TR_BODY_SELECTOR = 'tr[class^="scGridField"]'

var read_historico = function(browser, page, options){
    return new Promise(async resolve => {
        await page.waitForSelector(MENU_UNIFESP_SELECTOR)
        await page.click(MENU_UNIFESP_SELECTOR, {waitUntil: 'domcontentloaded'})
        await page.waitForSelector(UNIFESP_HISTORICO_SELECTOR)
        await page.click(UNIFESP_HISTORICO_SELECTOR, {waitUntil: 'domcontentloaded'})

        await page.waitForSelector(IFRAME_CONSULTA_SELECTOR)
        let $  = cheerio.load(await page.content())
        let iframe = $(IFRAME_CONSULTA_SELECTOR).attr('src')
        await page.goto(iframe, {waitUntil: 'domcontentloaded'})
        await page.waitForSelector(LINK_CONSULTA_SELECTOR)
        await page.click(LINK_CONSULTA_SELECTOR, {waitUntil: 'domcontentloaded'})

        await page.waitForSelector('table tbody td')
        let bodyHTML = await page.evaluate(() => document.body.innerHTML)

        fs.writeFileSync('historico.html', bodyHTML)

        resolve({
            html: bodyHTML,
            date: DateTime.utc().toString()
        })
    })
}

var compile_historico = function(html){
    return new Promise(async resolve => {
        const $ = cheerio.load(html)
        
        let headers = []

        $(TD_HEADER1_SELECTOR).each((i, node) => {
            if(!TD_HEADER1_EXCLUDES.includes(i)){
                let text = $(node).text().replace('\n', '').trim().split(': ')
                
                if(text.length == 1){
                    // try parsing date
                    let dt = DateTime.fromFormat(text[0], 'dd/MM/yyyy', { locale: 'utc' })
                    if(dt.isValid){
                        text = ['date', dt.toString()]
                    }
                }

                headers.push(text)
            }
        })

        $(TD_HEADER2_SELECTOR).each((i, node) => {
            headers.push($(node).find('tr td').toArray().map(td => $(td).text().trim()).filter(td => td != ':'))
        })

        let head = {}
        for(let header of headers){
            if(header[0] in TD_HEADER_TRANSLATION)
                head[TD_HEADER_TRANSLATION[header[0]]] = header[1]
            else head[header[0]] = header[1]
        }

        //fix entries
        head.cr && (head.cr = parseFloat(head.cr.replace(',', '.')))

        let body = []
        let column_names = $(TR_BODY_HEADER_SELECTOR).find('td').toArray().map(td => {
            let t = $(td).text().trim()
            if(t in TR_BODY_HEADER_TRANSLATION)
                return TR_BODY_HEADER_TRANSLATION[t]
            return t
        })

        $(TR_BODY_SELECTOR).each((i, node) => {
            let entry  = {}
            let list = $(node).find('td').toArray().map(td => $(td).text().trim(0))
            for(let i = 0; i < list.length; i++){
                let info = list[i]
                let name = column_names[i]

                if(name == 'uc'){
                    info = info.replace(' - ', '-').split('-')
                    entry['codigo'] = info[0]
                    info = info[1]
                }

                entry[column_names[i]] = info
            }

            // fix entries
            entry.conceito && (entry.conceito = parseFloat(entry.conceito.replace(',', '.')))

            body.push(entry)
        })

        resolve({
            ra_aluno: head.ra,
            nome: head.nome,
            historico: {
                ...head,
                ucs: body
            }
        })
    })
}

var save_historico = function(data){
    return new Promise(async resolve => {
        // TODO: implementar salvar historico
        console.log('save historico')
        resolve(true)
    })
}


var fetch_historico = function(browser, page, options){
    return new Promise(async resolve => {
        let browserPersistence = {}

        let historico = await read_historico(browser, page)
        options.puppeteerObject && options.puppeteerObject.destroy(options, browserPersistence)
        
        let compilado = await compile_historico(historico.html)
        browserPersistence.puppeteer && (historico.puppeteer = browserPersistence.puppeteer)

        historico = {
            date: historico.date,
            ...compilado
        }

        await save_historico(historico)

        resolve(historico)
    })
}

module.exports = {
    fetch: fetch_historico,
    read: read_historico,
    compile: compile_historico,
    save: save_historico
}