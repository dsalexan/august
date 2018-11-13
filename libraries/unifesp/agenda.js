const { DateTime } = require('luxon')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')

const {insert_extracao} = require('../../models/Unifesp')

const OFFLINE_MODE = false

//http://agendasjc.unifesp.br/class/Web/view-schedule.php?sd=2018-11-12
const AGENDA_HOME_LINK = 'http://agendasjc.unifesp.br/class/Web/view-schedule.php'
var AGENDA_DATE_LINK = starting_date => AGENDA_HOME_LINK + '?sd=' + starting_date.toString()

const TABLE_WEEKDAYS_SELECTOR = 'div#reservations div table.reservations'
const HEADER_WEEKDAYS_SELECTOR = 'tr:nth-of-type(1)'
const BODY_WEEKDAYS_SELECTOR = 'tr.slots'

var read_agenda = function(date){
    return new Promise(async (resolve, reject) => {
        date = date.startOf('week')
        
        request(AGENDA_DATE_LINK(date.toISODate()), (err, response, html) => {
            if(err) reject(err)

            fs.writeFileSync('agenda.html', html)

            resolve({
                reference: date.toString(),
                date: DateTime.local().toString(),
                html: html
            })
        })
    })
}

var handle_room_name = function(room){
    let or = room
    room = room.replace(' - ', '-').split('-').map(t => t.trim())
    let capacity

    if(room.length <= 1){
        capacity = 'unknown'
        room = room.length > 0 ? room[0].trim() : 'unknown'
    }else if(room.length == 2){
        capacity = room[1].trim()
        room = room[0].trim()

        if(capacity.search('lugares') != -1) {
            capacity = parseInt(capacity.replace(' lugares', ''))
        }else{
            room = room + ' - ' + capacity
            capacity = 'unknown'
        }
    }else if(room.length == 3){
        room = room.join(' - ')
        capacity = 'unknown'
    }

    return {
        room: room,
        capacity: capacity
    }
}

var compile_agenda = function(html){
    return new Promise(async (resolve, reject) => {        
        const $ = cheerio.load(html)  
    
        let weekdays = {}
        // pra cada dia da semana
        $(TABLE_WEEKDAYS_SELECTOR).each((_, div) => {
            let weekday = $(div).find(HEADER_WEEKDAYS_SELECTOR).find('td.resdate').text().trim()
            weekday = weekday.replace(', ', ',').split(',')
            let date = DateTime.fromString(weekday[1], 'dd/MM/yyyy')
            weekday = weekday[0]

            let headers = $(div).find(HEADER_WEEKDAYS_SELECTOR).find('td.reslabel').toArray().map(td => $(td).text())

            let duration = headers.map((_, index, array) => {
                if(index + 1 == array.length){
                    return (DateTime.fromString(array[index], 'hh:mm')).diff(DateTime.fromString(array[index - 1], 'hh:mm'), ['minutes']).toObject().minutes 
                }else{
                    return (DateTime.fromString(array[index + 1], 'hh:mm')).diff(DateTime.fromString(array[index], 'hh:mm'), ['minutes']).toObject().minutes 
                }
            })

            let body = {}
            // para cada sala
            $(div).find(BODY_WEEKDAYS_SELECTOR).each((i, tr) => {
                let data = {}
                let room = $(tr).find('td.resourcename').text().trim()
                room = handle_room_name(room)
                let capacity = room.capacity
                room = room.room

                // para cada horario da sala
                let horario = 0
                $(tr).find('td.slot').each((j, td) => {
                    let info = $(td).text().trim()
                    let colspan = parseInt($(td).attr('colspan'))
                    let specific_duration = duration.reduce((acc, cur, idx, array) => {
                        if(idx >= horario && idx < horario + colspan){
                            return acc + cur
                        }
                        return acc
                    }, 0)

                    if(info != '')
                        data[headers[horario]] = {
                            reservation: info,
                            duration: specific_duration
                        }

                    horario += colspan
                })

                body[room] = {
                    room: room,
                    capacity: capacity,
                    slots: data
                }
            })

            weekdays[weekday] = body
        })

        // TODO: store as UTC
        resolve({
            ...weekdays
        })
    })
}

var save_agenda = function(data){
    return new Promise(async (resolve, reject) => {
        insert_extracao({
            extracao: 'agenda',
            dados: data,
            datahora: DateTime.toSQL()
        }).then(row => {
            resolve(row)
        }).catch(err => {
            console.log('ERROR', 'insert extracao', err)
            reject(err)
        })
    })
}


var fetch_agenda = function(date, options){
    return new Promise(async resolve => {
        if(typeof date == 'string') date = DateTime.fromISO(date, {zone: 'America/Sao_Paulo'})
        
        let agenda = await read_agenda(date)

        let agenda_compilada = await compile_agenda(agenda.html)

        agenda = {
            reference: agenda.reference,
            date: agenda.date,
            ...agenda_compilada
        }

        agenda = await save_agenda(agenda)

        resolve(agenda)
    })
}

module.exports = {
    fetch: fetch_agenda,
    read: read_agenda,
    compile: compile_agenda,
    save: save_agenda
}
