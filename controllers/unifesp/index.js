var express = require('express')
var router = express.Router()

const { performance } = require('perf_hooks')
const _ = require('lodash')
const path = require('path')
const Diff = require('../../utils/diff')
const DateTime  = require('../../utils/luxon')
const Crypt  = require('../../utils/crypt')
const {Interval, Duration} = require('luxon')
const FuzzySet = require('fuzzyset.js')

const Unifesp = require('../../models/Unifesp')
const Alunos = require('../../models/Alunos')
const Grade = require('../../models/Grade')

const lib = require('../../libraries/unifesp')
const simplify = require('../../utils/simplify')

const {UC, Sala, Reserva} = require('../../libraries/unifesp/object')

const EMENTAS_DATA_EXPIRATION_INTERVAL = {seconds: 6}
const WEEKDAYS_REFERENCE = {
    'Segunda': 0,
    'Terça': 1,
    'Quarta': 2,
    'Quinta': 3,
    'Sexta': 4,
    'Sábado': 5,
    'Domingo': 6
}

const TAGS_POS = [
    'ppgcc'
]

function createFuzzy(_ucs){
    let FuzzySearch = {}

    let AliasIndex = {
        regular: {},
        nospace: {}
    }
    let AliasList = {
        regular: [],
        nospace: []
    }
    let AliasNoSpace = {}
    for(let _uc of _ucs){
        for(let alias of _uc.aliases){
            AliasIndex.regular[alias] = AliasIndex.regular[alias] || []
            AliasIndex.regular[alias].push(_uc)
            AliasList.regular.push(alias)

            let _nospace = alias.replace(/\s/gi, '')
            AliasIndex.nospace[_nospace] = AliasIndex.nospace[_nospace] || []
            AliasIndex.nospace[_nospace].push(_uc)
            AliasList.nospace.push(_nospace)       
            
            AliasNoSpace[_nospace] = AliasNoSpace[_nospace] || []
            AliasNoSpace[_nospace] = alias
        }
    }

    FuzzySearch.regular = FuzzySet(AliasList.regular)
    FuzzySearch.nospace = FuzzySet(AliasList.nospace)
    FuzzySearch._index = AliasIndex
    FuzzySearch._typeTranslator = AliasNoSpace

    FuzzySearch.index = (_result) => {
        return FuzzySearch._index[_result.type][_result.alias]
    }

    FuzzySearch.alias = (_result) => {
        if(_result.type == 'regular'){
            return _result.alias
        }else if(_result.type == 'nospace'){
            return FuzzySearch._typeTranslator[_result.alias]
        }

        return _result.alias
    }
    
    FuzzySearch.get = (word, _min=0.75) => {
        let _regular = FuzzySearch.regular.get(word, undefined, _min)
        let _nospace = FuzzySearch.nospace.get(word.replace(/\s/gi, ''), undefined, _min)

        _regular = (_regular || []).map(_result => {
            return {
                chunk: word, 
                alias: _result[1], 
                value: _result[0],
                type: 'regular'
            }
        })

        _nospace = (_nospace || []).map(_result => {
            return {
                chunk: word, 
                alias: _result[1], 
                value: _result[0],
                type: 'nospace'
            }
        })

        return (_regular || []).concat(_nospace || [])
    }

    return FuzzySearch
}

router.post('/encrypt/', (req, res, next) => {
    let text = req.body.text
    res.status(200).send(Crypt.encrypt(text, 'Achilles'))
})

router.post('/decrypt/', (req, res, next) => {
    let text = req.body.text
    res.status(200).send(Crypt.decrypt(text, 'Achilles'))
})

router.get('/saldo_ru/:ra_aluno', async (req, res, next) => {
    let ra_aluno = req.params.ra_aluno

    let aluno = await Alunos.select_aluno_ra(ra_aluno)
    aluno.senha_intranet = Crypt.decrypt(aluno.senha_intranet, 'Achilles')

    lib.fetch('saldo_ru', aluno).then(saldo => {
        res.status(200).send(saldo)
    }).catch(next)
})

router.get('/atestado/analysis/:ra_aluno', (req, res, next) => {
    var TRANSLATE_DIA = {
        seg: 'mon',
        ter: 'tue',
        qua: 'wed',
        qui: 'thu',
        sex: 'fri',
        sab: 'sat',
        dom: 'sun'
    }

    var ra_aluno = req.params.ra_aluno
    Alunos.select_latest_atestado(ra_aluno).then(async atestado => {
        if(atestado == null) return res.status(404).send({message: 'Atestado not found'})
        else{
            let classes = atestado.extracao.classes

            let ucs = []
            let not_found = []
            let multiple = []
            let classIndex = {}
            for(let c of classes){
                let class_name = simplify.text(c.uc.toLowerCase())
                let matches = await Unifesp.select_uc_alias(class_name)
                
                matches = matches.map(m => {
                    return {
                        ...m,
                        classe: c
                    }
                })

                if(matches.length == 0){
                    not_found.push(c)
                }else if(matches.length > 1){
                    // use levshstein for better matching
                    let _f = createFuzzy(matches)
                    let _ranking = _f.get(class_name)
                    _ranking.sort((v1, v2) => v2.value - v1.value)
                    
                    let _matches = [] 
                    let _MatchUCIndex = []
                    _ranking.forEach(_r => {
                        let _ucs = _f.index(_r)
                        for(let _uc of _ucs){
                            if(!_MatchUCIndex.includes(_uc.hash)){
                                _matches.push({
                                    uc: _uc,
                                    match: [_r.chunk, _f.alias(_r)],
                                    value: _r.value
                                })

                                _MatchUCIndex.push(_uc.hash)
                            }
                        }
                    })

                    let full__matches = _matches.filter(m => m.value == 1)

                    if(full__matches.length == 1){
                        ucs.push(full__matches[0].uc)
                    }else{
                        multiple.push({...c, matches: _matches})
                    }
                }else{
                    ucs.push(matches[0])
                }
            }

            let _unidades_curriculares = {}
            for(let uc of ucs){
                if(!_unidades_curriculares[uc.hash]) _unidades_curriculares[uc.hash] = []

                _unidades_curriculares[uc.hash].push({
                    nome: uc.classe.uc,
                    dia: uc.classe.dia,
                    inicio: uc.classe.inicio,
                    classe: uc.classe
                })
            }

            // achar aulas
            let aulas = []
            for(let hash_uc in _unidades_curriculares){
                for(let _unidade of _unidades_curriculares[hash_uc]){
                let _aulas = await Unifesp.select_aula_data_atestado(hash_uc, TRANSLATE_DIA[_unidade.dia], _unidade.inicio.replace('h', ':'))
                    
                    if(_aulas.length == 1){
                        aulas.push(_aulas.map(_a => {
                            return {
                                ..._a,
                                dia: _unidade.dia,
                                inicio: _unidade.inicio
                            }
                        })[0])
                    }else{
                        multiple.push({
                            ..._unidade.classe,
                            matches: _aulas
                        })
                    }
                }
            }

            let logs = []

            // para cada aula inserir em aluno_turma
            for(let aula of aulas){
                let turma = await Grade.select_turma_aula(aula.hash)

                if(turma != null){
                    let turma_aluno = await Grade.select_turma_aluno(ra_aluno, turma.id_turma)

                    if(turma_aluno == null){
                        // TODO: insert at aluno_turma
                        try{
                            await Grade.insert_aluno_turma(ra_aluno, turma.id_turma)
                        }catch(err){
                            let asda = err
                        }
                    }else{
                        console.log([undefined, `Turma already linked to aluno (${ra_aluno} / ${turma.id_turma})`])
                        logs.push({
                            warning: 'Turma already linked',
                            turma
                        })
                    }
                }else{
                    console.log([undefined, `Turma not found for aula ${aula.hash}`])
                    logs.push({
                        error: 'Turma not found',
                        aula
                    })
                }
            }


            res.status(200).send({
                logs,
                statistics: {
                    ucs_count: ucs.length,
                    classes_count: classes.length,
                    aulas_count: aulas.length,
                    not_found: not_found.map(c => c.uc),
                    multiple,
                },
                aulas,
                classes,
                atestado
            })


        }
    }).catch(error => {
        console.log(error)
        res.status(500).send({error})
    })
})

router.get('/atestado/:ra_aluno', async (req, res, next) => {
    let ra_aluno = req.params.ra_aluno

    let aluno = await Alunos.select_aluno_ra(ra_aluno)
    aluno.senha_intranet = Crypt.decrypt(aluno.senha_intranet, 'Achilles')

    lib.fetch('atestado', aluno).then(atestado => {
        res.status(200).send(atestado)
    }).catch(next)
})

router.get('/historico/:ra_aluno', async (req, res, next) => {
    let ra_aluno = req.params.ra_aluno

    let aluno = await Alunos.select_aluno_ra(ra_aluno)
    aluno.senha_intranet = Crypt.decrypt(aluno.senha_intranet, 'Achilles')

    lib.fetch('historico', aluno).then(atestado => {
        res.status(200).send(atestado)
    }).catch(next)
})


router.get('/agenda/transfer', (req, res, next) => {
    Unifesp.transfer_aulas().then(() => {
        res.status(200).send({
            message: 'done'
        })
    }).catch(error => {
        res.status(500).send({error})
    })
})

router.get('/agenda/check', (req, res, next) => {
    // TODO: implementar error checking
    
    // termo bate com a turma
    //SELECT *,  termo = turma FROM aula_termo;

    // carga horaria bate com o numero de reservas
    // SELECT A.hash,
    //     U.nome,
    //     STRING_AGG(R.horario, ', ') AS horarios,
    //     COUNT(R.horario) * 36 AS horas,            
    //     U.carga,
    //     (COUNT(R.horario) * 36)::TEXT || 'h' = U.carga
    // FROM aula A LEFT JOIN
    //     unidade_curricular u on A.hash_uc = u.hash LEFT JOIN (
    //     SELECT R.hash_aula,
    //         R.datahora,
    //         MIN(ARRAY_TO_STRING(R.horario, ' ')) AS horario
    //     FROM visao_reserva R
    //     GROUP BY R.hash_aula, R.datahora
    //     ) R ON A.hash = R.hash_aula
    // WHERE A.hash_uc != -284840886
    // GROUP BY A.hash, U.hash;

    // talvez criar uma tabela para guardar os erros atuais (das analises atuais) pra saber o que perguntar pro aluno no app
})

router.get('/agenda/analysis', (req, res, next) => {
    let mode = req.query.mode || 'analyse'
    let desc = req.query.desc || 'Análise Completa da Agenda, sete dias da semana'
    let dias_semana = (req.query.dias || 'Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo').split(', ')

    Unifesp.select_analise_latest('agenda').then(analysis => {
        let _do = []

        if(analysis != null && mode == 'view'){
            _do = [analysis]
        }else{
            // TODO: Implementar os updates
            _do.push(new Promise((resolve, reject) => {
                Unifesp.select_agenda().then(async agenda => {
                    if(agenda == null) return res.status(500).send({message: 'No agenda registered, run fetch first'})

                    let sqlAnalise = await Unifesp.insert_analise({
                        descricao: desc,
                        base: agenda.id_extracao,
                        datahora: DateTime.toSQL()
                    })

                    var UNKNOWN_UC = (await Unifesp.select_uc_nome('Unknown'))[0]   

                    var FuzzyUCS = Reserva.createFuzzy(await Unifesp.select_ucs())

                    let compiles = []
                    
                    let reservas = []
                    let capacities = {}
                    let rooms = {}
                    for(let _dia of dias_semana){
                        let ag = agenda.dados[_dia]
                        let numeric_day = DateTime.fromSQL(agenda.dados.reference).plus({days: WEEKDAYS_REFERENCE[_dia]})
                        reservas[_dia] = {}
                        for(let _sala in ag){
                            _sala = ag[_sala]
                            for(let _horario in _sala.slots){
                                reservas.push({
                                    key: _sala.slots[_horario].reservation,
                                    duration: _sala.slots[_horario].duration,
                                    room: _sala.room,
                                    time: _horario,
                                    weekday: _dia,
                                    day: numeric_day
                                })

                                if(capacities[_sala.room] == undefined) capacities[_sala.room] = []
                                capacities[_sala.room].push(_sala.capacity)

                                if(rooms[_sala.room] == undefined) rooms[_sala.room] = []
                                rooms[_sala.room].push(_sala.slots[_horario].reservation)
                            }
                        }
                    }
                    
                    var analysis_room = await agenda_analyse_rooms(rooms, capacities, sqlAnalise)

                    let k = 3
                    let m = Math.ceil(Object.keys(reservas).length / k)
                    for(let i = 0; i < k; i++){
                        compiles.push(agenda_analyse_day(reservas.slice(m*i, m*(i+1)), sqlAnalise, FuzzyUCS, analysis_room.data, UNKNOWN_UC))
                    }
                    
                    Promise.all(compiles).then(async (analises) => {
                        sqlAnalise.datahora = DateTime.toSQL()
                        sqlAnalise.logs = {
                            room: analysis_room,
                            analises: analises
                        }

                        Unifesp.update_analise(sqlAnalise).then(() => resolve(sqlAnalise)).catch(err => {
                            console.log('asdasdas', err)
                            reject(err)
                        })

                        resolve(sqlAnalise)
                    }).catch(err => {
                        console.log('compiling', err)
                        reject(err)
                    })
                })
            }))
        }

        Promise.all(_do).then(analysis => {
            analysis = analysis[0] || analysis

            console.log('AGENDA ANALYSED')
            res.status(200).send({
                message: 'Agenda analysed and added to database',
                analysis: analysis
            })
        }).catch(err => {
            console.log('analysis', err)
            res.status(500).send({
                message: 'Error when analysing agenda',
                error: err
            })
        })
    })
})

function agenda_analyse_rooms(rooms, capacities, sqlAnalise){
    return new Promise(async (resolve, reject) => {

        // compile room data
        var errors = []
        let RoomIndex = {}
        let reg = []
        for(let r in rooms){
            let sala = new Sala(r, sqlAnalise.id_analise)
            errors = errors.concat(sala.compile())
            
            let c = [...new Set(capacities[r])]
            if(c.length != 1){
                console.log(undefined, 'No consistent capacity found', c)
                errors.push('No consistent capacity found', c)
            }else{
                c = c[0]
                if(c =='unknown') c = undefined
            }
            sala.capacity = c

            let sqlSala = await Unifesp.select_sala_nome(sala.original)
            if(!sqlSala){
                sala.id_sala = (await Unifesp.insert_sala(sala)).id_sala
            }else{
                sala.id_sala = sqlSala.id_sala
                try{
                    await Unifesp.update_sala_id(sala)
                }catch(erer)
                {
                    asdasd = err
                }
            }

            RoomIndex[r] = sala
        }

        await Promise.all(reg)  

        resolve({
            data: RoomIndex,
            logs: errors,
            statistics: `${errors.length}/${Object.keys(RoomIndex).length}`
        })
    })
}

function agenda_analyse_day(reservas, sqlAnalise, FuzzyUCS, _ROOMS, UNKNOWN_UC){
    return new Promise(async (resolve, reject) => {
        // compile reservation data
        var errors = []
        let ReservationIndex = {}
        let AulasIndex = {}
        let reg = []
        for(let r of reservas){
            let _reserva = new Reserva(r.key, sqlAnalise.id_analise)
            _reserva.compile()
            let _e = _reserva.match(FuzzyUCS)
            errors = errors.concat(_e)

            _reserva.makeReserva(r, _ROOMS)
            _reserva.makeAula(UNKNOWN_UC)

            _reserva.generateHash()    

            AulasIndex[_reserva.hash] = _reserva.as_aula
            ReservationIndex[r.key] = _reserva.as_reserva
        }

        for(let hash in AulasIndex){
            let aula = AulasIndex[hash]

            let sqlAula = await Unifesp.select_aula_hash(aula.hash)
            if(!sqlAula){
                try{
                    await Unifesp.insert_aula(aula)
                }catch(err){
                    asdas = err
                }
            }else{
                let diff = Diff.diff(aula, sqlAula)
                if(Object.keys(diff).length == 0){
                    why = 11
                }else if(diff.id_analise){
                    await Unifesp.update_aula_hash(aula)
                }else{
                    console.log('ERROR: multiple data for same hash/aula')
                    errors.push('ERROR: multiple data for same hash/aula')
                    reject(diff)
                }
            }
        }

        for(let key in ReservationIndex){
            let reserva = ReservationIndex[key]
            
            try{
                let sqlReserva = await Unifesp.select_reserva_texto_datahora_sala(reserva.texto, reserva.datahora, reserva.id_sala)
                if(sqlReserva.length == 0){
                    await Unifesp.insert_reserva(reserva) 
                }else if(sqlReserva.length == 1){
                    reserva.id_reserva = sqlReserva[0].id_reserva
                    reg.push(Unifesp.update_reserva_id(reserva))
                }else{
                    console.log(`ERROR: Many reserva entries for texto(${reserva.texto}) and datahora(${reserva.datahora})`)
                    errors.push(`ERROR: Many reserva entries for texto(${reserva.texto}) and datahora(${reserva.datahora})`)
                }
            }catch(err){
                console.log('ERROR: insert reserva', err)
                errors.push('ERROR: insert reserva', err)
                reject(err)
            }
        }

        await Promise.all(reg)

        resolve({
            data: ReservationIndex,
            logs: errors,
            statistics: `${errors.length}/${Object.keys(ReservationIndex).length}`
        })
    })
}

router.get('/ementas/transfer', (req, res, next) => {
    Unifesp.transfer_ucs().then(() => {
        res.status(200).send({
            message: 'done'
        })
    }).catch(error => {
        res.status(500).send({error})
    })
})

router.get('/ementas/analysis', (req, res, next) => {
    let mode = req.query.mode || 'analyse'
    let desc = req.query.desc || 'Análise Completa das Ementas, mostly inserir no banco e encontrar os hashes dos pre requisitos'

    Unifesp.select_analise_latest('ementas').then(analysis => {
        let doAnalysis = []

        if(analysis == null && mode == 'view'){
            doAnalysis.push(analysis)
        }else{ // se ja existir uma analise previa
            doAnalysis.push(new Promise((resolve, reject) => {
                Unifesp.select_ementas().then(async result => {
                    if(result == null) return res.status(500).send({message: 'No ementas registered, run fetch first'})
            
                    let sqlAnalise = await Unifesp.insert_analise({
                        descricao: desc,
                        base: result.id_extracao,
                        datahora: DateTime.toSQL()
                    })

                    let reg = []
                    let UCIndex = {}

                    let unknown = new UC()
                    unknown.fromSummary({
                        hash: UC.verbose('unknown'),
                        nome: 'Unknown',
                        requisitos: [],
                        file: 'none',
                        carga: '00h',
                        id: 'unknown'
                    }, sqlAnalise.id_analise)
                    unknown.doAlias()
                    UCIndex[unknown.hash] = unknown

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
                    Object.keys(UCIndex).forEach(async hash => {
                        let uc = UCIndex[hash]
                        logs.errors = logs.errors.concat(uc.hashRequisites(listOfAliases))
                        
                        if(analysis == null){ // se nao existir analise previa
                            reg.push(Unifesp.register_uc(uc))
                        }else{
                            // verifica se a uc existe
                            let sqlUc = await Unifesp.select_uc(uc.hash)

                            if(sqlUc == null){ // se nao existir, registra
                                reg.push(Unifesp.register_uc(uc))
                            }else{ // se existir, atualiza
                                reg.push(Unifesp.update_uc(uc))
                            }
                        }
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
        if((force && date == undefined) || date == undefined){
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