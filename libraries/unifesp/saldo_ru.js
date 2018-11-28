const { DateTime } = require('luxon')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')
const G = require('generatorics')

const MENU_UNIFESP_SELECTOR = '#menuPrivado li:nth-of-type(2) a'
const UNIFESP_SALDO_RU_SELECTOR = '#tbCorpoVisual tr:nth-of-type(22) td a'
const CONSULTAR_SALDO_RU_SELECTOR = '#sec-content button'
const TABELA_SALDO_RU_SELECTOR = '.table-responsive:nth(1) tbody:nth(0) tr td:nth(1)'

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