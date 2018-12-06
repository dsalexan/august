const DateTime = require('../../utils/luxon')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')
const G = require('generatorics')

const Utilidades = require('../../models/Utilidades')

var check_saldo_ru = function(ra_aluno){
    return new Promise(async (resolve, reject) => {
        let read_from_intranet = false

        try{
            saldo = await Utilidades.select_latest_saldo_aluno(ra_aluno)
        }catch(error){
            reject(error)
        }

        if(saldo == null) read_from_intranet = true
        else{
            let ___ = DateTime.fromSQL(saldo.datahora)
            if(DateTime.fromSQL(saldo.datahora).diffNow('days').toObject().days < 1){
                let _DATE = DateTime.fromSQL(saldo.datahora).setZone("America/Sao_Paulo")
                let HOJE = DateTime.utc().setZone('America/Sao_Paulo')

                if(HOJE.hour < 12){ // antes do almoco, ve se atualizou depois da janta de ontem
                    if(_DATE.ordinal == HOJE.ordinal){ // se atualizou hoje
                        read_from_intranet = false
                    }else{ // se atualizou ontem
                        if(_DATE.hour >= 19){ // atualizou depois das 20h ontem
                            read_from_intranet = false
                        }else{ // atualizou antes das 20h
                            read_from_intranet = true
                        }
                    }
                }else if(HOJE.hour >= 12 && HOJE.hour <= 13){ // durante almoco
                    // nao tem como saber se provavelmente gastou ru ou nao
                    read_from_intranet = true
                }else{ // apos almoco
                    if(_DATE.ordinal < HOJE.ordinal){ // atualizou ontem
                        read_from_intranet = true
                    }else{ // atualizou hoje
                        if(_DATE.hour <= 13){ // atualizou hoje antes ou durante do almoco
                            read_from_intranet = true
                        }else{ // atualizou apos o almoco
                            read_from_intranet = false
                        }
                    }
                }
            }else{ // atualizou a mais de 1 dia
                read_from_intranet = true
            }
        }

        resolve({
            ...saldo,
            read_from_intranet
        })
    })
}

var read_saldo_ru = function(browser, page){
    return new Promise(async resolve => {

        let $  = cheerio.load(await page.content())

        let saldo
        if ($('.alert.alert-danger').length > 0)
            saldo = 0
        else {
            await page.waitForSelector('td.cell-qtd', {timeout : 120000})
            let $  = cheerio.load(await page.content())
            saldo = $('td.cell-qtd').text()
        }

        resolve({
            saldo,
            datahora: DateTime.utc()
        })
    })
}


var save_saldo_ru = function(data, ra_aluno){
    return Alunos.insert_saldo_ru({saldo: data.saldo}, DateTime.toSQL(data.datahora), ra_aluno)
}

var fetch_saldo_ru = function(browser, page, ra_aluno, options={}){
    return new Promise(async resolve => {
        let browserPersistence = {}
        let saldo

        try{
            saldo = await read_saldo_ru(browser, page)

            options && options.puppeteerObject && options.puppeteerObject.destroy(options, browserPersistence)
        }catch(error){
            saldo = {error}
        }

        saldo = await save_saldo_ru(saldo, ra_aluno)
        
        browserPersistence.puppeteer && (saldo.puppeteer = browserPersistence.puppeteer)

        resolve(saldo)
    })
}


module.exports = {
    check: check_saldo_ru,
    read: read_saldo_ru,
    fetch: fetch_saldo_ru
}