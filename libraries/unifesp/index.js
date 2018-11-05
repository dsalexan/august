var INTRANET_UNIFESP_URL = 'https://intranet.unifesp.br/'
var INTRANET_HISTORICO_URL = 'https://www3.unifesp.br/prograd/app_prograd/he_novo/he_aluno_cns_lista_cursos/he_aluno_cns_lista_cursos.php'

const puppeteer = require('puppeteer')
const _ = require('lodash')

const historico = require('./historico')
const atestado = require('./atestado')

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
            authenticated: false
        })
    }

    build(options){
        options = this.defaults(options)        
        
        return new Promise(resolve => {
            if(options.puppeteer == undefined){
                puppeteer.launch({
                    args: ['--deterministic-fetch'],
                    headless: true,
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

UNIFESP.fetch = function(what, user, options){
    return new Promise((resolve, reject) => {
        buildPuppet(options).then(async puppet => {
            options = puppet.defaults(options)
            var fn

            if(!options.authenticated){
                var attempt = await authenticatePuppeteer(puppet.page, user)
                if(!attempt.auth){
                    return reject(new Error('UNIFESP - Unable to authenticate browser before fetching'))
                }
            }
            options.puppeteerObject = puppet


            if(what == 'historico'){
                fn = historico.fetch
            }else if(what == 'atestado'){
                fn = atestado.fetch
            }

            if(fn){
                fn(puppet.browser, puppet.page, options).then(result => {
                    resolve(result)
                })
            }else{
                reject(new Error('UNIFESP - Fetching for "' + what + '" not implemented'))
            }
        })
    })
}

module.exports = UNIFESP