var express = require('express')
var router = express.Router()

const { performance } = require('perf_hooks')
const _ = require('lodash')
const path = require('path')
const DateTime  = require('../../utils/luxon')
const {Interval, Duration} = require('luxon')

const Unifesp = require('../../models/Unifesp')
const lib = require('../../libraries/unifesp')

const {UC} = require('../../libraries/unifesp/object')

const EMENTAS_DATA_EXPIRATION_INTERVAL = {seconds: 6}

router.get('/agenda/analysis', (req, res, next) => {
    let mode = req.query.mode || 'analyse'

    Unifesp.select_analise_latest('agenda').then(analysis => {
        let _do = []

        if(analysis != null && 1 == 2){
            if(mode == 'analyse'){
                throw new Error('Unimplemented overwrite of olde analysis')
            }else if(mode == 'view'){
                _do = [analysis]
            }
        }else{
            _do.push(new Promise((resolve, reject) => {
                Unifesp.select_agenda().then(agenda => {
                    if(agenda == null) return res.status(500).send({message: 'No agenda registered, run fetch first'})

                    
                })
            }))
        }
    })
})

router.get('/ementas/analysis', (req, res, next) => {
    let mode = req.query.mode || 'analyse'

    Unifesp.select_analise_latest('ementas').then(analysis => {
        let doAnalysis = []

        if(analysis != null){ // se ja existir uma analise previa
            if(mode == 'analyse'){
                doAnalysis.push(new Promise((resolve, reject) => {
                    Unifesp.select_ementas().then(async result => {
                        if(result == null) return res.status(500).send({message: 'No ementas registered, run fetch first'})
                
                        let sqlAnalise = await Unifesp.insert_analise({
                            base: result.id_extracao,
                            datahora: DateTime.toSQL()
                        })

                        let update_index = []
                        let reg = []
                        for(let id of Object.keys(result.dados)){
                            if(id == '__incomplete') continue
                            let summary = result.dados[id]
                
                            let uc = new UC()
                            uc.fromSummary(summary, sqlAnalise.id_analise)
                            uc.doAlias()
                
                            // verifica se a uc existe
                            let sqlUc = await Unifesp.select_uc(uc.hash)
    
                            if(sqlUc == null){ // se nao existir, registra
                                reg.push(Unifesp.register_uc(uc))
                            }else{ // se existir, atualiza
                                reg.push(Unifesp.update_uc(uc))
                            }
    
                            update_index.push(uc.hash)
                        }
            
                        await Promise.all(reg)
                        resolve(sqlAnalise)
                    })
                }))
            }else if(mode == 'view'){
                doAnalysis.push(analysis)
            }
        }else{
            doAnalysis.push(new Promise((resolve, reject) => {
                Unifesp.select_ementas().then(async result => {
                    if(result == null) return res.status(500).send({message: 'No ementas registered, run fetch first'})
            
                    let sqlAnalise = await Unifesp.insert_analise({
                        base: result.id_extracao,
                        datahora: DateTime.toSQL()
                    })

                    let reg = []
                    let UCIndex = {}
                    for(let id of Object.keys(result.dados)){
                        if(id == '__incomplete') continue
                        let summary = result.dados[id]
            
                        let uc = new UC()
                        uc.fromSummary(summary, sqlAnalise.id_analise)
                        uc.doAlias()

                        UCIndex[uc.hash] = uc
                    }

                    let listOfAliases = {}
                    Object.keys(UCIndex).forEach(hash => {
                        UCIndex[hash].aliases.forEach(alias => {
                            (listOfAliases[alias] = listOfAliases[alias] || []).push(hash)
                        })
                    })

                    let logs = {
                        errors: []
                    }
                    Object.keys(UCIndex).forEach(hash => {
                        let uc = UCIndex[hash]
                        logs.errors = logs.errors.concat(uc.hashRequisites(listOfAliases))

                        reg.push(Unifesp.register_uc(uc))
                    })
            
                    await Promise.all(reg)

                    sqlAnalise.datahora = DateTime.toSQL()
                    sqlAnalise.logs = logs
                    await Unifesp.update_analise(sqlAnalise)
                    resolve(sqlAnalise)
                })
            }))
        }

        Promise.all(doAnalysis).then(analysis => {
            analysis = analysis[0] || analysis

            res.status(200).send({
                message: 'Summaries analysed and added to database',
                analysis: analysis
            })
        }).catch(err => {
            console.log('analysis', err)
            res.status(500).send({
                message: 'Error when analysing ementas',
                error: err
            })
        })
    })
    
})

router.get('/agenda', (req, res, next) => {
    Unifesp.select_agenda().then(result => {
        let force = req.query.force || false
        let display = req.query.display || 'all'
        let date = req.body.date
        if(force && date == undefined){
            date = DateTime.utc().toFormat('yyyy-MM-dd', {zone: 'America/Sao_Paulo'})
        }

        let prom
        if(result == null || force){
            prom = lib.fetch('agenda', date)
        }else{
            prom = result
        }

        Promise.all([prom]).then(result => {
            result = result[0] || result

            let displayData
            if(display == 'all'){
                displayData = result
            }

            res.status(200).send({
                message: 'Agenda fetched',
                reference: result.dados.reference,
                data: displayData
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                error: err
            })
        })
    })
})

router.get('/ementas', (req, res, next) => {
    Unifesp.select_ementas().then(result => {
        let forceDownload = req.query.force || false
        let display = req.query.display || 'all'

        let prom
        if(result == null){
            prom = lib.fetch('ementas', {
                path: path.join(global.root_path, 'res/ementas'),
                download: forceDownload
            })
        }else{
            let timestamp = DateTime.fromSQL(result.datahora)
            let current_interval = Interval.fromDateTimes(timestamp, DateTime.utc()).toDuration('milliseconds')
            let expiration = Duration.fromObject(EMENTAS_DATA_EXPIRATION_INTERVAL).shiftTo('milliseconds')

            if(current_interval.as('milliseconds') > expiration.as('milliseconds')){ // já expirou
                prom = lib.fetch('ementas', {
                    path: path.join(global.root_path, 'res/ementas'),
                    download: forceDownload
                })
            }else{ // ta bom ainda
                prom = result
            }
        }

        Promise.all([prom]).then(result => {
            result = result[0] || result

            let displayData
            if(display == 'all'){
                displayData = result
            }else if(display == 'nomes'){
                displayData = Object.keys(result.dados).map(k => result.dados[k].nome)
            }

            res.status(200).send({
                message: 'Summaries fetched',
                count: Object.keys(result.dados).length - 1,
                data: displayData
            })
        }).catch(err => {
            res.status(500).send({
                error: err
            })
        })
    })
})

module.exports = router