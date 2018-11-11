const simplify = require('../../../utils/simplify')
const Combinatorics = require('js-combinatorics')
const _ = require('lodash')

class Alias{
    constructor(original_text){
        this.original = original_text
        this.simple = simplify.text(original_text)
        this.aliases = []
    }

    stopwords(word){
        return [
            'e', 
            'de',
            'do',
            'da',
            'das',
            'dos',
            'em',
            'na',
            'no',
            'nos',
            'nas',
            'para',
            'pra',
            'por'
        ].includes(word)
    }

    generate(){
        this.aliases.push(this.simple)

        // analisar plurais e singulares
        let num_variants = [this.simple]

        let words = this.simple.split(' ')
        let indexes = Array(words.length).fill().map((_, idx) => idx)

        let cmb = []
        for(let i = 0; i < indexes.length; i++){
            cmb = cmb.concat(Combinatorics.combination(indexes, i+1).toArray())
        }

        for(let config of cmb){
            num_variants.push(words.map((t, i) => config.includes(i)? simplify.singular(t) : t).join(' '))
        }

        num_variants = [...new Set(num_variants)]

        // gerar siglas e semi-siglas
        for(let variant of num_variants){
            let tokens = variant.split(' ')
    
            let lists = [tokens, tokens.filter(t => !this.stopwords(t))]
            if(_.isEqual(lists[0], lists[1])) lists = [lists[0]]
    
            for(let l of lists){
                indexes = Array(l.length).fill().map((_, idx) => l[idx].length > 3 ? idx : undefined).filter(i => i != undefined)
                
                let cmb = []
                for(let i = 0; i < indexes.length; i++){
                    cmb = cmb.concat(Combinatorics.combination(indexes, i+1).toArray())
                }
    
                for(let config of cmb){
                    this.aliases.push(l.map((t, i) => config.includes(i) ? t[0] : t).join(' '))
                }
            }
        }

        this.aliases = [...new Set(this.aliases)]
    }
}

module.exports = Alias