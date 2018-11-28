const simplify = require('../../../utils/simplify')
const Combinatorics = require('js-combinatorics')
const _ = require('lodash')

class Alias{
    constructor(original_text){
        this.original = original_text
        this.simple = simplify.text(original_text)
        this.aliases = []
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
    
            let stopwords = tokens.map((w, i) => [w, i]).filter(wi => simplify.stopword(wi[0])).map(wi => wi[1])
            let cmb = [[]]
            for(let i = 0; i < stopwords.length; i++){
                cmb = cmb.concat(Combinatorics.combination(stopwords, i+1).toArray())
            }

            let lists = []
            for(let config of cmb){
                lists.push(tokens.filter((_, i) => !config.includes(i))) // remove stopwords por gradiente
            }
    
            for(let l of lists){
                this.aliases.push(l.join(' '))
                indexes = Array(l.length).fill().map((_, idx) => l[idx].length >= 3 ? idx : undefined).filter(i => i != undefined)
                
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