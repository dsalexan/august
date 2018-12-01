var INTRANET_UNIFESP_URL = 'https://intranet.unifesp.br/'
var INTRANET_HISTORICO_URL = 'https://www3.unifesp.br/prograd/app_prograd/he_novo/he_aluno_cns_lista_cursos/he_aluno_cns_lista_cursos.php'
var CARDAPIO_URL = 'https://www.unifesp.br/campus/sjc/servicosnae/restaurante/1647-cardapio-semanal-do-ru.html'

const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const request = require('request')
const _ = require('lodash')

const historico = require('./historico')
const atestado = require('./atestado')
const professores = require('./professores')
const saldo_ru = require('./saldo_ru')
const agenda = require('./agenda')
const ementas = require('./ementas')

// GENERALIZING PUPPETEER PERSISTENCE AND DESTRUCTION
class Puppet {
    constructor(browser, page){
        this.browser = browser
        this.page = page
    }

    defaults(options){
        return _.defaultsDeep(options, {
            puppeteer: undefined,
            keep_puppet: false,
            authenticated: false,
            headless: process.env.HEADLESS != undefined ? process.env.HEADLESS == 'true' : true
        })
    }

    build(options){
        options = this.defaults(options)        
        
        return new Promise(resolve => {
            if(options.puppeteer == undefined){
                puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    headless: options.headless
                }).then(browser => {
                    this.browser = browser
                    browser.newPage().then(page => {
                        this.page = page
                        resolve()
                    })
                })
            }else{
                this.browser = options.puppeteer.browser
                this.page = options.puppeteer.page
                resolve()
            }
        })
    }

    destroy(options, attempt){
        options = this.defaults(options)

        if(options.keep_puppet && attempt) attempt.puppeteer = this.spread()    
        else this.browser.close()
    }

    spread(){
        return {
            browser: this.browser,
            page: this.page
        }
    }
}

var buildPuppet = function(options){
    return new Promise(resolve => {
        var puppet = new Puppet()
        puppet.build(options).then(() => {
            resolve(puppet)
        })
    })
}

// TODO: add error throwing for no internet connection
// GENERALIZING BROWSER UNIFESP LOGIN
var authenticatePuppeteer = function(page, user){
    const INPUT_USERNAME_SELECTOR = 'form[name="form1"] input[name="username"]'
    const INPUT_PASSWORD_SELECTOR = 'form[name="form1"] input[name="password"]'
    const BUTTON_SUBMIT_SELECTOR = 'form[name="form1"] input[type="submit"]'

    return new Promise(async (resolve, reject) => {
        await page.goto(INTRANET_UNIFESP_URL, {waitUntil: 'domcontentloaded'})
        await page.waitForSelector(INPUT_USERNAME_SELECTOR)
        await page.waitForSelector(INPUT_PASSWORD_SELECTOR)
        await page.waitForSelector(BUTTON_SUBMIT_SELECTOR)

        page.on('response', response => {
            if(response.url().indexOf('index3.php') != -1){
                if(response.url().indexOf('?loginx=') != -1){
                    resolve({auth: false, user: user.username})
                }else{
                    resolve({auth: true, user: user.username})
                }
            }
        })
        
        await page.click(INPUT_USERNAME_SELECTOR)
        await page.keyboard.type(user.username)
        
        await page.click(INPUT_PASSWORD_SELECTOR)
        await page.keyboard.type(user.password)
        
        await page.click(BUTTON_SUBMIT_SELECTOR)
    })
}

// METHODS
UNIFESP = {}

// recebe o nome de usuario e senha e tenta conectar com o proxy da unifep
UNIFESP.authenticate = function(username, password, options){
    var user = {
        username: username,
        password: password
    }

    return new Promise(async (resolve, reject) => {
        var puppet = await buildPuppet(options)
        
        if(!options.authenticated)
            var attempt = await authenticatePuppeteer(puppet.page, user)
        else
            return reject(new Error('Trying to authenticate user on a already authenticated browser'))
        
        puppet.destroy(options, attempt)

        resolve(attempt)
    })
}

UNIFESP.getCorpoDocente = function() {
    return new Promise((resolve, reject) => {
        buildPuppet().then(async puppet => {
            await puppet.page.goto('http://www.unifesp.br/campus/sjc/corpodocente.html')

            professores.getProfs(puppet.page).then(result => {
                // console.log({"professores": result})
                resolve({"professores": result})
            })
        })
    })
}

UNIFESP.getSaldoRu = function(login, senha) {
    return new Promise((resolve, reject) => {
        buildPuppet().then(async puppet => {
            await puppet.page.goto('https://phpu.unifesp.br/ru_consulta/index.php')

            saldo_ru.read(puppet.page, login, senha).then(result => {
                resolve({"saldo_ru": result})
            })
        })
    })
}

UNIFESP.authenticateProxyAndRegister = function(username, password){
    const INPUT_USERNAME_SELECTOR = 'form[name="form1"] input[name="username"]'
    const INPUT_PASSWORD_SELECTOR = 'form[name="form1"] input[name="password"]'
    const BUTTON_SUBMIT_SELECTOR = 'form[name="form1"] input[type="submit"]'

    const LINK_CONSULTA_SELECTOR = 'a.scGridFieldOddLink'
    const TD_RA_SELECTOR = 'td.scGridBlock tr:eq(2) td:eq(2)'

    var user = {
        username: username,
        password: password
    }

    return new Promise(async (resolve, reject) => {
        const puppeteer = require('puppeteer')

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(INTRANET_UNIFESP_URL)

        page.on('response', async response =>{
            if(response.url().indexOf('index3.php') != -1){
                if(response.url().indexOf('?loginx=') != -1){
                    resolve({auth: false, user: user.username})
                }else{
                    // entra na pagina
                    await page.goto(INTRANET_HISTORICO_URL)
                    await page.click(LINK_CONSULTA_SELECTOR)
                    await page.$eval(TD_RA_SELECTOR, element => {
                        resolve({auth: true, user: user.username, ra: element.textContent})
                    })
                }
                browser.close()
            }
        })
        
        await page.click(INPUT_USERNAME_SELECTOR)
        await page.keyboard.type(user.username)
        
        await page.click(INPUT_PASSWORD_SELECTOR)
        await page.keyboard.type(user.password)
        
        await page.click(BUTTON_SUBMIT_SELECTOR)
    })
}

UNIFESP.readCardapio = function(date) {
    var cardapio_json = {
        cardapio: {
            almoco: {
                segunda: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                terca: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                quarta: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                quinta: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                sexta: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
            },
            janta: {
                segunda: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                terca: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                quarta: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                quinta: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
                sexta: {
                    prato_base: null,
                    prato_principal: null,
                    opcao_vegetariana: null,
                    guarnicao: null,
                    sobremesa: null
                },
            }
        }
    }
    return new Promise(async (resolve, reject) => {
        // const browser = await puppeteer.launch()
        // const page = await browser.newPage()
        // await page.goto(CARDAPIO_URL)
        
        request(CARDAPIO_URL, function(err, resp, html) {
            if (!err) {
                const $ = cheerio.load(html);
                var rows = $("table").find("tr");

                // almoco
                cardapio_json.cardapio.almoco.segunda.prato_base = $(rows[1]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.almoco.terca.prato_base = $(rows[1]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.almoco.quarta.prato_base = $(rows[1]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.almoco.quinta.prato_base = $(rows[1]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.almoco.sexta.prato_base = $(rows[1]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.almoco.segunda.prato_principal = $(rows[2]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.almoco.terca.prato_principal = $(rows[2]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.almoco.quarta.prato_principal = $(rows[2]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.almoco.quinta.prato_principal = $(rows[2]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.almoco.sexta.prato_principal = $(rows[2]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.almoco.segunda.opcao_vegetariana = $(rows[3]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.almoco.terca.opcao_vegetariana = $(rows[3]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.almoco.quarta.opcao_vegetariana = $(rows[3]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.almoco.quinta.opcao_vegetariana = $(rows[3]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.almoco.sexta.opcao_vegetariana = $(rows[3]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.almoco.segunda.guarnicao = $(rows[4]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.almoco.terca.guarnicao = $(rows[4]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.almoco.quarta.guarnicao = $(rows[4]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.almoco.quinta.guarnicao = $(rows[4]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.almoco.sexta.guarnicao = $(rows[4]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.almoco.segunda.sobremesa = $(rows[5]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.almoco.terca.sobremesa = $(rows[5]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.almoco.quarta.sobremesa = $(rows[5]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.almoco.quinta.sobremesa = $(rows[5]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.almoco.sexta.sobremesa = $(rows[5]).children("td:nth-child(6)").text().trim();
                
                // janta
                cardapio_json.cardapio.janta.segunda.prato_base = $(rows[7]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.janta.terca.prato_base = $(rows[7]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.janta.quarta.prato_base = $(rows[7]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.janta.quinta.prato_base = $(rows[7]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.janta.sexta.prato_base = $(rows[7]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.janta.segunda.prato_principal = $(rows[8]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.janta.terca.prato_principal = $(rows[8]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.janta.quarta.prato_principal = $(rows[8]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.janta.quinta.prato_principal = $(rows[8]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.janta.sexta.prato_principal = $(rows[8]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.janta.segunda.opcao_vegetariana = $(rows[9]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.janta.terca.opcao_vegetariana = $(rows[9]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.janta.quarta.opcao_vegetariana = $(rows[9]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.janta.quinta.opcao_vegetariana = $(rows[9]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.janta.sexta.opcao_vegetariana = $(rows[9]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.janta.segunda.guarnicao = $(rows[10]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.janta.terca.guarnicao = $(rows[10]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.janta.quarta.guarnicao = $(rows[10]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.janta.quinta.guarnicao = $(rows[10]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.janta.sexta.guarnicao = $(rows[10]).children("td:nth-child(6)").text().trim();
                
                cardapio_json.cardapio.janta.segunda.sobremesa = $(rows[11]).children("td:nth-child(2)").text().trim();
                cardapio_json.cardapio.janta.terca.sobremesa = $(rows[11]).children("td:nth-child(3)").text().trim();
                cardapio_json.cardapio.janta.quarta.sobremesa = $(rows[11]).children("td:nth-child(4)").text().trim();
                cardapio_json.cardapio.janta.quinta.sobremesa = $(rows[11]).children("td:nth-child(5)").text().trim();
                cardapio_json.cardapio.janta.sexta.sobremesa = $(rows[11]).children("td:nth-child(6)").text().trim();
                
                resolve({
                    data: date,
                    json_cardapio: JSON.stringify(cardapio_json)
                })
            } else {
                reject()
            }
        });

        // $ = cheerio.load(await page.content())
        // let date = $('table tr')
        // console.log('EU', date)
        // date.each((i, e)=> {
        //     console.log('i',i)
        //     console.log('e',e)
        // })
        //const element = await page.$("$('table tr')[1]")
        //const text = page.evaluate(() => document.querySelector('table tr').textContent);
        //const element = await page.$('table tr')[1];
        //const text = await (await element.getProperty('textContent')).jsonValue();
        //console.log(textContent);
        //const element = await page.$('table tr');
        // await page.evaluate(element => {
        //     console.log('ELEMENT', element)
        //     // resolve({a: element.textContent})
        // }, element)
    
        
        
    })
}

UNIFESP.insertCardapio = function(what, user, options){
    // TODO: Como assim isso ta vazio??
}


UNIFESP.fetch = function(what, data, options){
    return new Promise((resolve, reject) => {
        if(options == undefined) options = {}

        puppet = [false]
        if(what == 'historico' || what == 'atestado' || what == 'saldo_ru'){
            // options.headless = true
        }else if(what == 'ementas'){
            // options.headless = true
        }else if(what == 'agenda'){
            options.puppeteer = false
        }
        buildPuppet(options).then(async puppet => {
            options = puppet.defaults(options)
            var fn

            if(what == 'historico' || what == 'atestado' || what == 'saldo_ru'){
                if(!options.authenticated){
                    var attempt = await authenticatePuppeteer(puppet.page, data) // data == user
                    if(!attempt.auth){
                        return reject(new Error('UNIFESP - Unable to authenticate browser before fetching'))
                    }
                }
            }
            options.puppeteerObject = puppet

            if(what == 'historico'){
                fn = () => historico.fetch(puppet.browser, puppet.page, options)
            }else if(what == 'atestado'){
                fn = () => atestado.fetch(puppet.browser, puppet.page, data.ra_aluno, options)
            }else if (what == 'saldo_ru') {
                fn = () => saldo_ru.read(puppet.browser, puppet.page, options)
            }else if(what == 'agenda'){
                fn = () => agenda.fetch(data, options) // data == reference date
            }else if(what == 'ementas'){
                fn = () => ementas.fetch(puppet.browser, puppet.page, data.path, data.download, options)
            }

            if(fn){
                fn().then(result => {
                    resolve(result)
                })
            }else{
                reject(new Error('UNIFESP - Fetching for "' + what + '" not implemented'))
            }
        })
    })
}

module.exports = UNIFESP