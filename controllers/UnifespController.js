var INTRANET_UNIFESP_URL = 'https://intranet.unifesp.br/'

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