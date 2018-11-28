
const simplify = require('../../../utils/simplify')
const Combinatorics = require('js-combinatorics')

var ACRONYMS_AGENDA_TRANSLATE = [
    [/lab\.?/gi, 'Laboratório de'],
    [/inf\.?/gi, 'Informática'],
    [/sala\s?/gi, 'Sala '],
    [/pq\.?\s?tec\.?/gi, 'Parque Tecnológico'],
    [/andar/gi, 'Andar']
].map(r => {
    return {
        regex: r[0],
        repl: r[1]
    }
})


var ADJUSTS_RESERVATION = [
    [/\s\.\s/gi, ' - '],
    [/\s?[\n\-]\s?/gi, '-'],
    [/\((.*)\-(.*)\)/gi, '$1$2'],
    [/\((.*)\)/gi, '-$1'],
    [/prof[\.a:ª]*/gi, 'professor'],
    [/lab\.?(\s?)\b/gi, 'laboratorio de$1'],
    [/eng\.?(\s?)\b/gi, 'engenharia$1'],
    [/top\.?(\s?)\b/gi, 'topico$1'],
    [/esp\.?(\s?)\b/gi, 'especial$1'],
    [/eq\.?(\s?)\b/gi, 'equacao$1']
].map(r => {
    return {
        regex: r[0],
        repl: r[1]
    }
})

class Sala{
    constructor(nome, id_analise){
        this.original = nome
        this.translation = ACRONYMS_AGENDA_TRANSLATE.reduce((string, rule) => string.replace(rule.regex, rule.repl), nome)
        
        this.number = undefined
        this.floor = undefined
        this.campus = 'Parque Tecnológico'
        this.description = undefined
        this.capacity = undefined

        this.id_analise = id_analise
    }

    compile(){
        var errors = []

        let possibilities = this.translation.split(/ - /gi)
        let number, floor, campus, description = []

        number = /\d{3}/gi.exec(this.translation)
        if(number != null) number = number[0]
        for(let _str of possibilities){
            if(_str.match(/^.*sala\s?(\d{1,3})\s?.*$/gi)){
                let _n = /^.*sala\s?(\d{1,3})\s?.*$/gi.exec(_str)
                if(number != null){
                    if(_n[1] != number){
                        console.log(undefined, 'WARNING: Two numeric rooms, code is confused', _n[1], number)
                        errors.push('Two numeric rooms, code is confused', _n[1], number)

                        number = _n[1]
                    }else{
                        number = _n[1]
                    }
                }else{
                    number = _n[1]
                }
            }else if(_str.match(/andar/gi)){
                floor = _str.replace(/\s?andar/gi, '').replace(/\s+/, '')
                floor = floor.replace(/[°º]/gi, '').trim()
            }else{
                description.push(_str.replace(/\s+/, ' ').trim())
            }
        }

        for(let d of description){
            if(d.match(/parque\s?tecnol(o|ó)gico/gi)){
                campus = 'Parque Tecnológico'
            }else if(d.match(/t(e|é)rreo/gi)){
                floor = 0
            }
        }

        if(floor == undefined && number != undefined && number != null && number.length == 3){
            floor = number[0]
        }

        this.number =  number && parseInt(number)
        this.floor =  floor && parseInt(floor)
        campus && (this.campus = campus)
        this.description =  description

        return errors
    }
}

module.exports = Sala