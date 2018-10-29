var INTRANET_UNIFESP_URL = 'https://intranet.unifesp.br/'
var INTRANET_HISTORICO_URL = 'https://www3.unifesp.br/prograd/app_prograd/he_novo/he_aluno_cns_lista_cursos/he_aluno_cns_lista_cursos.php'

// recebe o nome de usuario e senha e tenta conectar com o proxy da unifep
module.exports.authenticateProxy = function(username, password){
    const INPUT_USERNAME_SELECTOR = 'form[name="form1"] input[name="username"]'
    const INPUT_PASSWORD_SELECTOR = 'form[name="form1"] input[name="password"]'
    const BUTTON_SUBMIT_SELECTOR = 'form[name="form1"] input[type="submit"]'

    var user = {
        username: username,
        password: password
    }
    return new Promise(async (resolve, reject) => {
        const puppeteer = require('puppeteer')

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(INTRANET_UNIFESP_URL)

        page.on('response', response => {
            if(response.url().indexOf('index3.php') != -1){
                if(response.url().indexOf('?loginx=') != -1){
                    resolve({auth: false, user: user.username})
                }else{
                    resolve({auth: true, user: user.username})
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

module.exports.authenticateProxyAndRegister = function(username, password){
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

        page.on('response', response => {
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