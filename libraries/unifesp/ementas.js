const DateTime = require('../../utils/luxon')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const request = require('request-promise')
const _request = require('request')
const events = require('events')
const pdfreader = require('pdfreader')
const PDFParser = require("pdf2json")

const {insert_extracao} = require('../../models/Unifesp')

const {UC} = require('./object')

const OFFLINE_MODE = false

const INTRANET_LINK = 'https://www.unifesp.br'

const CATALOGO_LINK = 'https://www.unifesp.br/campus/sjc/catalogo-de-disciplinas/catalogo-de-ucs.html'

const LETRAS_CATALOGO_SELECTOR = 'div#phoca-dl-category-box div.pd-subcategory'
const DISCIPLINA_CATALOGO_SELECTOR = 'div#phoca-dl-category-box div.pd-filebox div.pd-filenamebox a'
const FORM_DISCIPLINA_SELECTOR = 'form#phocadownloadform'
const SUBMIT_FORM_SELECTOR = 'form#phocadownloadform input#pdlicensesubmit'

const VIGENTES_LINK = 'https://www.unifesp.br/campus/sjc/catalogo-de-disciplinas/ucs-vigentes.html'

const LINKS_VIGENTES_SELECTOR = 'div#sp-component article.item-page section.entry-content div.accordion .collapse a'

const PDF_LINES_TRANSLATE = {
    'nomedocomponentecurricular': 'nome',
    'componentecurricular': 'nome',
    'prerequisitos': 'requisitos',
    'cargahorariatotal': 'carga'
}

function removeAcento (text){       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
}

function parsePdf1(file){
    return new Promise((resolve, reject) => {        
        var page = 1
        var pages = {}
        var rows = {}
        new pdfreader.PdfReader().parseFileItems(file, function(err, item){
            if(item == undefined){
                pages[page] = rows

                let items = []
                for(let i = 1; i <= page; i++){
                    let p = []

                    rows = pages[i]
                    Object.keys(rows) // => array of y-positions (type: float)
                        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
                        .forEach((y) => p.push((rows[y] || []).join('').replace(new RegExp('[ ]+','gi'), ' ').trim()))

                    items = items.concat(p)
                }

                resolve(items, file)
            }else if(item.page){
                if(item.page != page){
                    pages[page] = rows
                    rows = {}
                    page = item.page
                }
            }else if(item.text){
                (rows[item.y] = rows[item.y] || []).push(item.text);
            }
        })
    })
}

function parsePdf(file){
    return new Promise((resolve, reject) => {
        let pdfParser = new PDFParser(this, 1)
    
        pdfParser.on("pdfParser_dataError", reject )
        pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve(pdfParser.getRawTextContent().split(/\r?\n/))
        });
    
        pdfParser.loadPDF(file)
    })
}

var read_letters = function(){  
    return new Promise(async resolve => {
        let html = await request(CATALOGO_LINK)
    
        const $ = cheerio.load(html)
    
        let letters = $(LETRAS_CATALOGO_SELECTOR).toArray().map(div => {
            let letter = $(div).find('a').text().trim() 
            let href = $(div).find('a').attr('href').trim()
            let amount = parseInt($(div).find('small').text().trim().replace('(', '').replace(')', ''))
    
            if(amount > 0){                
                return {
                    letter: letter,
                    link: INTRANET_LINK + href
                }
            }else{
                return {
                    letter: letter,
                    link: undefined
                }
            }
        })

        resolve(letters)
    })
}

var read_summaries = function(letters){
    return new Promise(async resolve => {
        let urls = letters.map(l => l.link).filter(l => l != undefined).map(l => request(l))

        Promise.all(urls).then(htmls => {
            var $
            var links = []
            for(let html of htmls){
                $ = cheerio.load(html)
                let l = $(DISCIPLINA_CATALOGO_SELECTOR).toArray().map(a => $(a).attr('href'))
                links = links.concat(l)
            }

            resolve(links)
        })
    })
}

var read_vigentes = function(){
    return new Promise(async resolve => {
        let html = await request(VIGENTES_LINK)
        const $ = cheerio.load(html)

        let links = $(LINKS_VIGENTES_SELECTOR).toArray().map(a => $(a).attr('href'))

        resolve(links)
    })
}

var read_ementas = function(browser, page, downloadPath, forceDownload, options){
    return new Promise(async (resolve, reject) => {     
        
        // FETCH CATALOGO DE UCS
        console.log('    Fetching <CATALOGO DE UCS>...')
        let letters = await read_letters()
        let links = await read_summaries(letters)

        for(let link of links){
            let files = fs.readdirSync(downloadPath)

            let disciplina = link.replace('/campus/sjc/catalogo-de-disciplinas/catalogo-de-ucs/file/', '')
            disciplina = disciplina.substring(disciplina.indexOf('-') + 1, disciplina.lastIndexOf('.'))
            let filename = disciplina + '.pdf'

            if(forceDownload || !files.includes(filename)){
                if(files.includes(filename)){
                    fs.unlinkSync(path.join(downloadPath, filename))
                }

                await page.goto(INTRANET_LINK + link, {waitUntil: 'domcontentloaded'});
                
                await page.waitForSelector(SUBMIT_FORM_SELECTOR)
                const submit = await page.$(SUBMIT_FORM_SELECTOR)
                await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: downloadPath})
                await submit.click({ clickCount: 1, delay: 100 })

                var newFiles
                var newFile
                do{
                    await page.waitFor(250)
                    newFiles = fs.readdirSync(downloadPath)
                    newFile = newFiles.filter(f => !files.includes(f))
                } while(newFile.length != 1 || newFile[0].split('.').pop() != 'pdf')
                
                newFile = newFile[0]
                fs.renameSync(path.join(downloadPath, newFile), path.join(downloadPath, filename))
            }
        }

        // FETCH UCS VIGENTES
        console.log('    Fetching <UCS VIGENTES>...')
        var getNameFromLink = (l) => decodeURIComponent(l.split('/').pop())

        links = await read_vigentes()
        var stack = [...links]
        var loopChecker = []
        let counter = -1
        while(stack.length > 0){
            counter++
            if(counter > links.length){
                if(forceDownload){
                    console.log('        Running loop to double check failed downloads...')
                }else{
                    break
                }
            }

            let link = stack.shift()
            loopChecker.push(stack.length)
            if(loopChecker.length > 50) {
                loopChecker.shift()
                if([...new Set(loopChecker)].length == 1) {
                    break
                }
            }

            let name = removeAcento(getNameFromLink(link).toLowerCase()).replace(new RegExp('[_ ]','gi'), '-')
            if(!fs.existsSync(path.join(downloadPath, name))){
                try{
                    let res = await request({
                        uri: INTRANET_LINK + link,
                        method: 'GET',
                        encoding: "binary",
                        headers: {
                            'Content-type': 'applcation/pdf'
                        },
                        resolveWithFullResponse: true
                    })

                    let n = removeAcento(getNameFromLink(res.request.href).toLowerCase()).replace(new RegExp('[_ ]','gi'), '-')
                    let writeStream = fs.createWriteStream(path.join(downloadPath, n))

                    writeStream.write(res.body, 'binary')
                    writeStream.on('finish', () => {
                        if(stack.length == 0) resolve({})
                    })
                    writeStream.end()
                }catch (err){
                    stack.push(link)
                }                    
            }else{
                if(stack.length == 0) resolve({})
            }
        }

        resolve({
            incomplete: {
                vigentes: stack
            }
        })
    })
}

var compile_ementas = function(folder){
    return new Promise(async (resolve, reject) => {
        var clear_column = text => {
            let t = removeAcento(text).toLowerCase()
            t = t.replace(/\s+/gi, '')
            t = t.replace(/\-+/gi, '')
            return t
        }
        var find = (text) => {
            for(let col of Object.keys(PDF_LINES_TRANSLATE)){
                text = clear_column(text)
                if(text.search(col) != -1){
                    return col
                }
            }

            return false
        }
        
        let data = {}
        for(let file of fs.readdirSync(folder)){
            let summary = await parsePdf(path.join(folder, file))
            let reversed = []
            let line_size = summary.map((l, i) => {
                return {
                    index: i, 
                    length: l.length
                }
            }).sort((l1, l2) => l2.length - l1.length)


            if(file == 'laboratorio-de-sistemas-computacionais-arquitetura-e-organizacao-de-computadores.pdf')
            {
                para = ''
            }

            let j = 0
            for(let i = summary.length-1; i > 0; i--){
                let max_length = line_size[0].length

                let line = summary[i]
                let prev = summary[i-1]
                let next = summary[i+1]

                reversed.push(line)

                let merge = false
                if(prev.length > line.length || Math.abs(line.length - prev.length) <= max_length * 0.20){ // se a diferença entre as linhas estiver nos 15%
                    if(prev.length > max_length * 0.80){ // se a linha anterior tem ao menos 85% do numero de caracteres da maior linha (pog)
                        // se nao e um header, ex: "Complementar:"
                        if(!(line.trim()[line.trim().length-1] == ':' || line.trim()[line.trim().length-2] == ':' || line.trim()[line.trim().length-3] == ':')){
                            if(!find(line)){  // essential data is not merged-up
                                // se a gente considerar que faz parte da linha de cima
                                let c = reversed.pop() || ''
                                c = prev + ' ' + c
                                reversed.push(c)
                                i--

                                merge = true
                            }
                        }
                    }
                }
            }
            if(reversed[reversed.length-1].search(summary[0]) == -1) reversed.push(summary[0])

            summary = reversed.map(l => l.replace(/\s+/gi, ' ').trim())
            summary.reverse()

            let essential_data = summary.filter(l => find(l))

            if(essential_data.length != 3){
                (data['__incomplete'] = data['__incomplete'] || []).push({
                    file: file,
                    top: summary.slice(0, 5),
                    essential_data: essential_data
                })
            }else{
                let uc = {}
                for(let d of essential_data){
                    let col = find(d)
                    uc[PDF_LINES_TRANSLATE[col]] = d.substring(d.indexOf(':') + 1).trim()
                }

                if(file == "aspectos-de-implementacao-de-banco-de-dados.pdf"){
                    padsasd = 1
                }

                uc.id = UC.namefy(uc.nome)
                uc.hash = UC.verbose(uc.id)
                uc.file = file
                uc.carga = uc.carga.replace(/\s/gi, '').replace('hs', 'h')
                uc.requisitos = uc.requisitos.replace(/(; )/, ';').split(';')

                if(clear_column(uc.requisitos.join('')).toLowerCase() == 'naoha') uc.requisitos = []

                data[uc.id] = uc
            }
        }

        // TODO: criar codigo para tentar localizar dentro dos dados compilados os dados incompletos (tanto de catalogo, vigencias ou daqui mesmo)

        resolve(data)
    })
}

var save_ementas = function(data){
    return new Promise(async (resolve, reject) => {
        insert_extracao({
            extracao: 'ementas',
            dados: data,
            datahora: DateTime.toSQL()
        }).then(row => {
            resolve(row)
        }).catch(err => {
            console.log('ERROR', 'insert extracao', err)
            reject(err)
        })
    })
}


var fetch_ementas = function(browser, page, downloadPath, forceDownload, options){
    return new Promise(async resolve => {    
        let browserPersistence = {}

        console.log('READING EMENTAS')
        // let ementas_imcompletas = await read_ementas(browser, page, downloadPath, forceDownload)
        let ementas_imcompletas = {}
        options.puppeteerObject && options.puppeteerObject.destroy(options, browserPersistence)

        console.log('COMPILING EMENTAS')
        let ementas = await compile_ementas(downloadPath)

        ementas.__incomplete = {
            ...ementas_imcompletas,
            compiladas: ementas.__incomplete
        }
        browserPersistence.puppeteer && (ementas.puppeteer = browserPersistence.puppeteer)

        console.log('SAVING EMENTAS')
        ementas = await save_ementas(ementas)

        resolve(ementas)
    })
}

module.exports = {
    fetch: fetch_ementas,
    read: read_ementas,
    compile: compile_ementas,
    save: save_ementas
}
