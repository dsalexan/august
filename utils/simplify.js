
const Combinatorics = require('js-combinatorics')

var text = function(text, specials=false, white_space=false){
    let t = text
    t = t.toLowerCase()                                                         
    t = t.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a')
    t = t.replace(new RegExp('[ÉÈÊ]','gi'), 'e')
    t = t.replace(new RegExp('[ÍÌÎ]','gi'), 'i')
    t = t.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o')
    t = t.replace(new RegExp('[ÚÙÛ]','gi'), 'u')
    t = t.replace(new RegExp('[Ç]','gi'), 'c')
    if(!specials) {
        t = t.replace(new RegExp('[,:\\.]+', 'gi'), '')
        t = t.replace(/\-/gi, ' ')
    }
    if(!white_space){
        t = t.replace(/\s+/gi, ' ')
        t = t.replace(/\s+$/gi, '')
        t = t.replace(/^\s+/gi, '')
    }

    return t
}

var singular = function(t){
    rules = [
        [/ares$/gmi, 'ar'],
        [/oes$/gmi, 'ao'],
        [/es$/gmi, 'e'],
        [/os$/gmi, 'o'],
        [/as$/gmi, 'a'],
        [/ais$/gmi, 'al']
    ].map(i => {return {
        reg: i[0],
        repl: i[1]
    }})

    for(let rule of rules){
        if(t.match(rule.reg)){
            return t.replace(rule.reg, rule.repl)
        }
    }

    return t
}

var stopword = function(word){
    return [
        'e', 
        'a',
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
        'por',
        'sobre'
    ].includes(word)
}


var combinate = function(word, fn, indexes=undefined){
    !indexes && (indexes = Array(word.length).fill().map((_, idx) => idx))

    let cmb = []
    for(let i = 0; i < word.length; i++){
        cmb = cmb.concat(Combinatorics.combination(indexes, i+1).toArray())
    }

    for(let config of cmb){
        fn(word.filter((_, i) => config.includes(i)), config)
    }
}

var stopword_gradient = function(word){
    let tokens = word.split(' ')
                        
    let stopwords = tokens.map((w, i) => [w, i]).filter(wi => stopword(wi[0])).map(wi => wi[1])
    let cmb = [[]]
    for(let i = 0; i < stopwords.length; i++){
        cmb = cmb.concat(Combinatorics.combination(stopwords, i+1).toArray())
    }

    return cmb.map(config => tokens.filter((_, i) => !config.includes(i)).join(' '))
}

module.exports = {
    text: text,
    singular: singular,
    stopword: stopword,
    combinate: combinate,
    gradient: (type, word) => {
        let fn
        switch(type){
            case 'stopword': 
            case 'stopwords': {
                fn  = stopword_gradient
                break
            }
        }

        if(fn) return fn(word)

        return word
    }
}