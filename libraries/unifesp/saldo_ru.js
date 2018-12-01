const { DateTime } = require('luxon')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')
const G = require('generatorics')

var a = ''
var b = ''

var read_saldo_ru = function(page, login, senha){
    return new Promise(async resolve => {
        const INPUT_USERNAME_SELECTOR = 'input#user'
        const INPUT_PASSWORD_SELECTOR = 'input#password'
        const BUTTON_SUBMIT_SELECTOR = 'button#btn-login'

        await page.waitForSelector(INPUT_USERNAME_SELECTOR)
        await page.waitForSelector(INPUT_PASSWORD_SELECTOR)
        await page.waitForSelector(BUTTON_SUBMIT_SELECTOR)

        await page.click(INPUT_USERNAME_SELECTOR)
        await page.keyboard.type(login)

        await page.click(INPUT_PASSWORD_SELECTOR)
        await page.keyboard.type(senha)
        
        await page.click(BUTTON_SUBMIT_SELECTOR)

        try {
            await page.waitForSelector('.col-sm-9', {timeout : 120000})
        } catch (e) {
            if (e instanceof TimeoutError) {
                resolve(null)
            }
        }

        let $  = cheerio.load(await page.content())

        if ($('.alert.alert-danger').length > 0)
            saldo = 0
        else {
            await page.waitForSelector('td.cell-qtd', {timeout : 120000})
            let $  = cheerio.load(await page.content())
            saldo = $('td.cell-qtd').text()
        }

        resolve(saldo)
    })
}

module.exports = {
    read: read_saldo_ru
}