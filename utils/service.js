const DateTime = require('../utils/luxon')
const _ = require('lodash')

const Crypt = require('./crypt')

const Unifesp = require('../models/Unifesp')
const Alunos = require('../models/Alunos')

const lib = require('../libraries/unifesp')
const ObjectSchedule = require('../libraries/unifesp/object/schedule')
const node_schedule = require('node-schedule');

var delay = function(milliseconds){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds)
    })
}

var waitFor = function(id_servico, _delay=1000){
    return new Promise(async (resolve, reject) => {
        let servico = {ativo:true}
        try{
            while(servico.ativo){
                servico = await Unifesp.select_servico(id_servico)

                servico.ativo && await delay(_delay)
            }
        }catch(error){
            reject(error)
        }

        resolve()
    })
}


var analyse_schedules = function(){
    return new Promise(async (resolve, reject) => {
        let schedules = await Unifesp.select_schedules()
        let spots = []
        // criar spots para
        //  saldo ru -> after 13h and 20h
        //  agenda -> inicio do dia
        
        let master_schedule = new ObjectSchedule(1)

        console.log('Indexing existent schedules...')

        let scheduleIndex = []
        for(let _s of schedules){
            scheduleIndex.push({
                servico: _s.servico,
                args: _s.args
            })

            master_schedule.add({
                hour: _s.repetir.hour,
                minute: _s.repetir.minute
            }, _s)
        }

        console.log('Scheduling "saldo_ru" fetches...')

        // pesquisar saldo ru
        let alunos = await Alunos.select_alunos()
        for(let aluno of alunos){
            // pra cada aluno, ver se ja nao existe uma schedule pra ele
            // se existir, nada faz
            // se nao existir, adiciona a schedule
            let __s = {
                servico: 'saldo_ru',
                args: {aluno: aluno.ra_aluno}
            }

            if(scheduleIndex.filter(s => _.isEqual(s, __s)).length == 0){
                let ra_aluno = aluno.ra_aluno

                // escolhe 2 spots, antes do almoco
                let _spots = []
                _spots.push(master_schedule.spot({hour: 9}, {hour: 12})) // antes do almoco
                _spots.push(master_schedule.spot({hour: 13, minute: 30}, {hour: 17})) // antes da janta

                for(let _spot of _spots){
                    let _hour = _spot.hour
                    let _minute = _spot.minute

                    let _j = await Unifesp.insert_schedule(
                        'saldo_ru',
                        {
                            aluno: ra_aluno
                        },
                        DateTime.toSQL(),
                        {
                            hour: _hour,
                            minute: _minute
                        }
                    )

                    master_schedule.add(_spot, _j)
                }
            }
        }

        console.log('Scheduling "agenda" fetches...')

        // pesquisar agenda semanal
        // adicionar a schedule para fetch da agenda semanal todo dia de madruga
        let __s = {
            servico: 'agenda',
            args: {
                hoje: true,
                after: 'run_analysis'
            }
        }
        if(scheduleIndex.filter(s => _.isEqual(s, __s)).length == 0){
            let _spot = master_schedule.spot({hour: 0}, {hour: 5})

            // let _j = await Unifesp.insert_schedule(
            //     'agenda',
            //     __s.args,
            //     DateTime.toSQL(),
            //     {
            //         hour: _spot.hour,
            //         minute: _spot.minute
            //     }
            // )

            // master_schedule.add(_spot, _j)
        }

        console.log('Scheduling analysis finished')
        resolve()
    })
}

function run_job(job){  
    return new Promise(async (resolve, reject) => {
        let index = job.index     
        global.jobs.running.push(index)
        
        let aluno

        if(job.args.aluno){
            aluno = await Alunos.select_aluno_ra(job.args.aluno)
            job.args.login_intranet = Crypt.decrypt(aluno.login_intranet, 'Achilles')
            job.args.senha_intranet = Crypt.decrypt(aluno.senha_intranet, 'Achilles')
        }else if(job.args.hoje){
            job.args.date = DateTime.utc().setZone('America/Sao_Paulo')
        }
    
        let servico = await Unifesp.insert_servico(job.servico, DateTime.toSQL(), job.args.ra_aluno || (job.args.aluno && job.args.aluno.ra_aluno) || null)
        
        let result = await lib.fetch(job.servico, job.args, {servico: servico})
    
        if(job.args.after){
            console.log(job.args.after)
        }
    
        global.jobs.running = global.jobs.running.filter(item => item != index)
        global.jobs.done.push(index)
    
        console.log('Scheduled job result:')
        console.log(aluno && aluno.ra_aluno, result)
        resolve(result)
    })     
}

var run_schedules = function(){
    return new Promise(async (resolve, reject) => {
        //clear globals
        let clear_globals = node_schedule.scheduleJob(DateTime.toLocalObject({
            hour: 23,
            minute: 59,
            second: 59,
            zone: 'America/Sao_Paulo'
        }), function(){
            console.log('Reseting daily jobs variables...')

            global.jobs.done = []
            global.jobs.running = []
        })

        let schedules = await Unifesp.select_schedules()

        console.log('Scheduling jobs...')

        for(let _job of schedules){
            let _index = `${_job.servico}_${Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 5)}`
            _job.index = _index

            let j = node_schedule.scheduleJob(DateTime.toLocalObject({
                    ..._job.repetir,
                    zone: 'America/Sao_Paulo'
            }), async function(job){
                console.log(`Running job ${job.servico} with ${Object.keys(job.args)}/${Object.values(job.args)}...`)

                let result = await run_job(job)
            }.bind(null, _job))

            j.index = _index
            global.jobs.index[_index] = j
        }

        // TODO: pegar o horario atual dessa linha e executar todas as schedules entre agora e 00h de hoje

        let now = DateTime.utc().setZone('America/Sao_Paulo')
        let _past_ones = schedules.filter(s => DateTime.fromObject({...s.repetir, zone: 'America/Sao_Paulo'}) < now)

        console.log(`Running past ones (${_past_ones.length}) for ${now.toString()}...`)

        let q = []
        for(let i = 0; i < _past_ones.length; i+=3){
            console.log(`    Running ${i}, ${i+1}, ${i+2} of ${_past_ones.length}`)
            await Promise.all([
                run_job(_past_ones[i]),
                i+1 < _past_ones.length ? run_job(_past_ones[i+1]) : true,
                i+2 < _past_ones.length ? run_job(_past_ones[i+2]) : true,
            ])
        }

        console.log('Scheduling completed')
        resolve()
    })
}

module.exports = {
    delay: delay,
    waitFor: waitFor,
    analyse: analyse_schedules,
    run: run_schedules
}