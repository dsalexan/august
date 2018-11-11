const simplify = require('../../../utils/simplify')
const Alias = require('./alias')

class UC{
    constructor(){
        this.id = 'unknown'
        this.hash = 'unknown'
        this.nome = 'unknown'
        this.requisitos = 'unknown'
        this.arquivo = 'unknown'
        this.carga = 'unknown'
        this.alias = 'unknown'
    }

    get aliases(){
        return this.alias.aliases
    }

    doAlias(){
        this.alias = new Alias(this.nome)
        this.alias.generate()
    }

    fromSummary(summary){
        this.summary = summary

        this.hash = summary.hash
        this.nome = summary.nome
        this.requisitos = summary.requisitos
        this.arquivo = summary.file
        this.carga = summary.carga

        if(summary.id == simplify.text(this.nome)){
            this.id = summary.id
        }else{
            throw new Error(`Summary ID and simplified name dont match (${summary.id}, ${simplify.text(this.nome)})`)
        }
    }

}

UC.namefy = simplify.text

UC.verbose = function(s){
    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0
    return h
}


module.exports = UC