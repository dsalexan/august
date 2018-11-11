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

const EMENTAS_DATA_EXPIRATION_INTERVAL = {months: 6}

router.get('/ementas/analysis', (req, res, next) => {
    let mode = req.query.mode || 'analyse'

    Unifesp.select_analise_latest('ementas').then(analysis => {
        let doAnalysis = []

        if(analysis != null){ // se ja existir uma analise previa
            if(mode == 'analyse'){
                doAnalysis.push(new Promise((resolve, reject) => {
                    Unifesp.select_ementas().then(async result => {
                        if(result == null) return res.status(500).send({message: 'No ementas registered, run fetch first'})
                
                        let update_index = []
                        let reg = []
                        for(let id of Object.keys(result.dados)){
                            if(id == '__incomplete') continue
                            let summary = result.dados[id]
                
                            let uc = new UC()
                            uc.fromSummary(summary)
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
    
                        // verifica as ucs que não foram atualizadas ou inseridas agora mas estao no banco (as que sobraram da analise antnerior)
                        let ucs = await Unifesp.select_ucs_not_hash(update_index)
                        
                        for(let uc of ucs){
                            reg.push(Unifesp.delete_uc_hash(uc.hash)) // remove o que sobrou de antes
                        }
            
                        Promise.all(reg).then(() => {
                            Unifesp.insert_analise({
                                base: result.id_extracao,
                                datahora: DateTime.toSQL()
                            }).then(analysis => {
                                resolve(analysis)
                            })
                        }).catch(reject)
                    })
                }))
            }else if(mode == 'view'){
                doAnalysis.push(analysis)
            }
        }else{
            doAnalysis.push(new Promise((resolve, reject) => {
                Unifesp.select_ementas().then(result => {
                    if(result == null) return res.status(500).send({message: 'No ementas registered, run fetch first'})
            
                    let reg = []
                    for(let id of Object.keys(result.dados)){
                        if(id == '__incomplete') continue
                        let summary = result.dados[id]
            
                        let uc = new UC()
                        uc.fromSummary(summary)
                        uc.doAlias()
            
                        reg.push(Unifesp.register_uc(uc))
                    }
            
                    Promise.all(reg).then(() => {
                        Unifesp.insert_analise({
                            base: result.id_extracao,
                            datahora: DateTime.toSQL()
                        }).then(analysis => {
                            resolve(analysis)
                        })
                    }).catch(reject)
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