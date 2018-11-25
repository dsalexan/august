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


        
        // await page.waitForSelector('#form-login')
        // let $  = cheerio.load(await page.content())
        // console.log($('.title-text-login').text())
        // $('#user').val(login)
        // $('#password').val(senha)

        console.log(typeof login)
    //    await page.evaluate((login, senha) => {
    //         document.querySelector('#user').value = login;
    //         document.querySelector('#password').value = senha;
    //     }, login, senha)

        a = login
        b = senha
    
       
        await page.$eval("input[name=user]", el => {el.val(login)}, login)
        await page.$eval("input[name=password]", el => {el.value = senha}, {senha})
    //     const a = login
    //     const b = senha
    // await page.$eval("input[name=user]", el => el.value = a)
    // await page.$eval("input[name=password]", el => el.value = b)

        // await page.waitForSelector('')
        // console.log(await page.content())
        await page.click('button[type=submit]')

        await page.waitForSelector('#div-saldo')
        let $  = cheerio.load(await page.content())
        console.log($('#div-saldo'))

        // let $  = cheerio.load(await page.content())
        // console.log($(MENU_UNIFESP_SELECTOR).text())
        // await page.click('#btn-login')

        
        // await page.waitForSelector('title')
        // $  = cheerio.load(await page.content())
        // console.log($('.title-text-login').text())

        // console.log(1)
        // await page.waitForSelector(MENU_UNIFESP_SELECTOR)
        // let $  = cheerio.load(await page.content())
        // console.log($(MENU_UNIFESP_SELECTOR).text())
        // await page.click(MENU_UNIFESP_SELECTOR)
        // console.log(1)

        // await page.waitForSelector(UNIFESP_SALDO_RU_SELECTOR)
        
        // // let $  = cheerio.load(await page.content())
        // // console.log($(UNIFESP_SALDO_RU_SELECTOR).text())

        // // await page.waitForSelector(UNIFESP_SALDO_RU_SELECTOR)
        // await page.click(UNIFESP_SALDO_RU_SELECTOR)
        // console.log(1)

        // // let $  = cheerio.load(await page.content())
        // // console.log($('div'))
        // // await page.waitForSelector('title')
        // // let $  = cheerio.load(await page.content())
        // // console.log($('title').text())


        // await page.waitForSelector('title')
        // console.log(await page.content())

        // await page.click(CONSULTAR_SALDO_RU_SELECTOR)
        // console.log(1)

        // await page.waitForSelector(TABELA_SALDO_RU_SELECTOR)
        // // let $  = cheerio.load(await page.content())
        // // let iframe = $(TABELA_SALDO_RU_SELECTOR).length()
        // // console.log(1)

        // let teste = $(TABELA_SALDO_RU_SELECTOR).attr('length')
        // console.log(1)

        // var saldo = 0
        // if (teste != 0)
        // {
        //     saldo = $(TABELA_SALDO_RU_SELECTOR)[0].textContent
        //     console.log(1)
        // }

        // resolve(saldo)
    })
}

module.exports = {
    read: read_saldo_ru
}