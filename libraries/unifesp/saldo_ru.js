const { DateTime } = require('luxon')
const cheerio = require('cheerio')
const fs = require('fs')
const G = require('generatorics')

const MENU_UNIFESP_SELECTOR = '#menuPrivado li:nth-of-type(2) a'
const UNIFESP_SALDO_RU_SELECTOR = '#tbCorpoVisual tr:nth-of-type(22) td:nth-of-type(1) a'
const CONSULTAR_SALDO_RU_SELECTOR = '#sec-content button'
const TABELA_SALDO_RU_SELECTOR = '.table-responsive:nth(1) tbody:nth(0) tr td:nth(1)'

var read_saldo_ru = function(browser, page, options){
    return new Promise(async resolve => {
        // clicar em Menu>Unifesp
        await page.waitForSelector(MENU_UNIFESP_SELECTOR)
        await page.click(MENU_UNIFESP_SELECTOR)

        await page.waitForSelector(UNIFESP_SALDO_RU_SELECTOR)
        await page.click(UNIFESP_SALDO_RU_SELECTOR)

        await page.waitForSelector(CONSULTAR_SALDO_RU_SELECTOR)
        await page.click(CONSULTAR_SALDO_RU_SELECTOR)

        await page.waitForSelector(TABELA_SALDO_RU_SELECTOR)
        let $  = cheerio.load(await page.content())
        let iframe = $(TABELA_SALDO_RU_SELECTOR).length()

        let teste = $(TABELA_SALDO_RU_SELECTOR).attr('length')

        var saldo = 0
        if (teste != 0)
        {
            saldo = $(TABELA_SALDO_RU_SELECTOR)[0].textContent
        }

        resolve(saldo)
    })
}

module.exports = {
    read: read_saldo_ru
}