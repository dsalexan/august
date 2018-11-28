
const simplify = require('../../../utils/simplify')
const Combinatorics = require('js-combinatorics')
const FuzzySet = require('fuzzyset.js')
const DateTime  = require('../../../utils/luxon')

const Unifesp = require('../../../models/Unifesp')

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
    [/eq\.?(\s?)\b/gi, 'equacao$1'],
    [/femag/gi, 'fenomenos eletromagneticos']
].map(r => {
    return {
        regex: r[0],
        repl: r[1]
    }
})


function _analysableChunks(chunks, multiple=false) {
    if(multiple){
        return chunks.filter(c => [undefined, 'aula', 'reposicao', 'monitoria'].includes(c.type) && c.chunk != '').slice(0, multiple)
    }

    return chunks.filter(c => [undefined, 'aula', 'reposicao', 'monitoria'].includes(c.type) && !c.multiple && c.chunk != '')
}

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

class Reserva{
    constructor(nome, id_analise){
        this.original = nome
        this.translation = ADJUSTS_RESERVATION.reduce((string, rule) => string.replace(rule.regex, rule.repl), simplify.text(nome, true, true).trim())
        this.translation = this.translation.replace(/(\s?)\-\s*\-(\s?)/, '$1-$2')
        this.id_analise = id_analise
    }

    get as_aula(){
        return {
            hash: this.hash,
            hash_uc: this.hash_uc,
            turma: this.turma,
            professor: this.professor,
            responsavel: this.responsavel,
            monitoria: this.monitoria,
            aula: this.aula,
            reposicao: this.reposicao,
            id_analise: this.id_analise
        }
    }

    get as_reserva(){
        return {
            texto: this.original,
            duracao: this.duracao,
            id_sala: this.id_sala,
            datahora: this.datahora,
            hash_aula: this.hash,
            id_analise: this.id_analise
        }
    }

    makeAula(UNKNOWN_UC){
        if(this.uc){
            this.hash_uc = this.uc.split('/')[0]
        }else{
            this.hash_uc = UNKNOWN_UC.hash
        }
    }

    makeReserva(data, roomIndex){
        this.duracao = data.duration
        this.datahora = data.day.setZone('America/Sao_Paulo')
        this.datahora = this.datahora.set({
            hour: parseInt(data.time.split(':')[0]),
            minute: parseInt(data.time.split(':')[1])
        })
        this.datahora = DateTime.toSQL(this.datahora.setZone('UTC'))
        this.id_sala = roomIndex[data.room].id_sala
    }

    generateHash(){
        let uc_hash = this.uc && String(this.uc).split('/')[0]
        if(this.uc == undefined) {
            if(this.possibilities && this.possibilities.length > 0){
                uc_hash = 'MULTIPLE'
            }else if(this.possibilities && this.possibilities.length > 0){
                uc_hash = 'MULTIPLE'
            }else{
                uc_hash = 'UNKNOWN'
            }

            uc_hash = `${uc_hash}{${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase()}}`
        }

        let _turma = !this.turma ? `UNKNOWN{${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase()}}` : String(this.turma)

        let ano = '2018'
        let semestre = '2'

        this.hash = `${uc_hash}/${ano}/${semestre}/${_turma}`
    }

    compile(){
        var _chunks = []
        simplify.combinate(this.translation.split('-'), (tokens, config) => {
            let _v = tokens.join(' - ')
            let _type
            let _display_v = _v

            if(_v.match(/\bprofessor\b/gi)){
                _type = 'professor'
                _display_v = _display_v.replace(/\s?professor\s?/gi, '')
            }else if(_v.match(/\bresponsavel\b/gi)){
                _type = 'responsavel'
                _display_v = _display_v.replace(/\s?responsavel\s?/gi, '')
            }else if(_v.match(/\bturma\b/gi)){
                _type = 'turma'
                _display_v = _display_v.replace(/\s?turma\s?/gi, '')
            }else if(_v.match(/\bmonitora?(es)?\b/gi)){
                _type = 'responsavel'
                _display_v = _display_v.replace(/\s?monitora?\s?/gi, '')
            }else if(_v.match(/\bmonitoria\b/gi)){
                _type = 'monitoria'
                _display_v = _display_v.replace(/\s?monitoria\s?/gi, '')
            }else if(_v.match(/\breposicao\b/gi)){
                _type = 'reposicao'
                _display_v = _display_v.replace(/\s?reposicao\s?/gi, '')
            }else if(_v.match(/\baula\b/gi)){
                _type = 'aula'
                _display_v = _display_v.replace(/\s?aula\s?/gi, '')
            }else{
                _display_v = simplify.text(_display_v).split(/[\s]/gi).map(w => w.length >= 3 ? simplify.singular(w) : w).join(' ')
            }
            
            _chunks.push({
                chunk: _display_v,
                original: _v,
                type: _type,
                multiple: config.length > 1,
                gradient: {}
            })
        })

        this.uc = undefined
        this.matches = undefined
        this.turma = _chunks.filter(c => c.type == 'turma' && !c.multiple).map(c => c.chunk.toUpperCase())
        this.professor = _chunks.filter(c => c.type == 'professor' && !c.multiple).map(c => c.chunk)
        this.responsavel = _chunks.filter(c => c.type == 'responsavel' && !c.multiple).map(c => c.chunk)
        this.monitoria = _chunks.filter(c => c.type == 'monitoria' && !c.multiple).length > 0
        this.aula = _chunks.filter(c => c.type == 'aula' && !c.multiple).length > 0
        this.reposicao = _chunks.filter(c => c.type == 'reposicao' && !c.multiple).length > 0
        this.possibilities = undefined
        this.chunks = _chunks

        this.turma = this.turma.length == 1 ? this.turma[0] : this.turma.length == 0 ? undefined : this.turma 
        this.professor = this.professor.length == 1 ? this.professor[0] : this.professor.length == 0 ? undefined : this.professor 
        this.responsavel = this.responsavel.length == 1 ? this.responsavel[0] : this.responsavel.length == 0 ? undefined : this.responsavel  
    }

    async analyse(chunk){
        let _uc = await Unifesp.select_uc_alias(chunk)

        if(_uc.length > 0){
            if(_uc.length == 1){
                if(undefined == this.uc) this.uc = []
                try{
                    this.uc = this.uc.concat(_uc)
                }catch(ex){
                    asdasd = 1
                }
            }else{
                if(undefined == this.possibilities) this.possibilities = []
                this.possibilities = this.possibilities.concat(_uc)
            }
        }
    }

    defrag(){
        if(this.uc){
            if(this.uc.length == 1){
                this.uc = `${this.uc[0].hash}/${this.uc[0].nome}`
            }else{
                if(this.possibilities){
                    this.possibilities = this.uc.concat(this.possibilities)
                    this.uc = undefined
                }else{
                    this.possibilities = this.uc
                    this.uc = undefined
                }
            }
        }
    }

    match(FuzzyUCS){
        var errors = []
        if(this.original.length > 225){
            console.log(`    Reservation for too big (${this.original.length}) for gradient search...`)
            errors.push(`    Reservation for too big (${this.original.length}) for gradient search...`)
            return errors
        }

        // regular search, look up chunks on database aliases
        for(let _c of _analysableChunks(this.chunks)){
            this.analyse(_c.chunk)
        }

        // formatar corretamente e reorganizar as ucs
        this.defrag()
        let _max_multiple_chunks = 3

        // se ZERO CORRESPONDENCIAS, gradient of chunks by stopwords
        // gradient search
        if(this.uc == undefined && this.possibilities == undefined){
            for(let _c of _analysableChunks(this.chunks, _max_multiple_chunks)){
                if(_c.gradient.stopwords == undefined) _c.gradient.stopwords = simplify.gradient('stopwords', _c.chunk)

                let _gradient = _c.gradient.stopwords

                for(let _g of _gradient){
                    this.analyse(_g)
                }
            }
        }

        // se MANY CORRESPONDENCIAS, run levshestein on possibles/all (when possibles is empty)
        // levenshtein search
        if(this.uc == undefined){
            var FuzzySearch = this.possibilities ? createFuzzy(this.possibilities) : FuzzyUCS

            var ranking = []
            for(let _c of _analysableChunks(this.chunks, _max_multiple_chunks)){
                if(_c.gradient.stopwords == undefined) _c.gradient.stopwords = simplify.gradient('stopwords', _c.chunk)

                let _gradient = _c.gradient.stopwords

                for(let _g of _gradient){
                    ranking = ranking.concat(FuzzySearch.get(_g))
                }
            }
            ranking = ranking.sort((p1, p2) => p2.value - p1.value)

            let matches = [] 
            let _MatchUCIndex = []
            ranking.forEach(_r => {
                let _ucs = FuzzySearch.index(_r)
                for(let _uc of _ucs){
                    if(!_MatchUCIndex.includes(_uc.hash)){
                        matches.push({
                            uc: _uc,
                            match: [_r.chunk, FuzzySearch.alias(_r)],
                            value: _r.value
                        })

                        _MatchUCIndex.push(_uc.hash)
                    }
                }
            })

            let full_matches = matches.filter(m => m.value == 1)

            if(full_matches.length == 1){
                this.uc = `${matches[0].uc.hash}/${matches[0].uc.nome}`
            }else if(full_matches.length == 0 && matches.length == 1){
                this.uc = `${matches[0].uc.hash}/${matches[0].uc.nome}`
            }else if(matches.length > 0){
                let partial_matches = matches.filter(m => m.value >= 0.95)
                if(partial_matches.length >= 1){
                    this.uc = `${partial_matches[0].uc.hash}/${partial_matches[0].uc.nome}`
                    this.matches = matches.slice(1)
                }else{
                    this.matches = matches
                }
            }
        }
        

        if(this.uc == undefined && this.matches == undefined){
            if(this.possibilities == undefined){
                errors.push([undefined, '0 UCS', this.original])
                console.log(errors[errors.length - 1])
            }else{
                errors.push([undefined, `${this.possibilities.length} POSSIBILITIES`, this.original, this.possibilities.map(p => p.nome).join(', ')])
                console.log(errors[errors.length - 1])
            }
        }else if(this.uc == undefined && this.matches){
            errors.push([undefined, `${this.matches.length} MATCHES`, this.original, this.matches.map(m => `${m.uc.nome} (${m.value})`).join(', ')])
            console.log(errors[errors.length - 1])
        }

        return errors
    }
}

Reserva.createFuzzy = createFuzzy

module.exports = Reserva