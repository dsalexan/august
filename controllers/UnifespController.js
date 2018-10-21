// recebe o nome de usuario e senha e tenta conectar com o proxy da unifep
module.exports.authenticateProxy = function(username, password){
    var user = {
        username: username,
        password: password
    }
    return new Promise((resolve, reject) => {
        const puppeteer = require('puppeteer');

        (async () => {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.goto('https://example.com')
            await page.screenshot({path: 'example.png'})

            await browser.close()
        })()
    })
}