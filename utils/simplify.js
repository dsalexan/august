var text = function(t){
    t = t.toLowerCase()                                                         
    t = t.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a')
    t = t.replace(new RegExp('[ÉÈÊ]','gi'), 'e')
    t = t.replace(new RegExp('[ÍÌÎ]','gi'), 'i')
    t = t.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o')
    t = t.replace(new RegExp('[ÚÙÛ]','gi'), 'u')
    t = t.replace(new RegExp('[Ç]','gi'), 'c')
    t = t.replace(new RegExp('[,:\\-\\.]', 'gi'), '')
    t = t.replace(new RegExp('[ ]+','gi'), ' ')
    t = t.trim()

    return t
}

var singular = function(t){
    rules = [
        [/os$/i, 'o'],
        [/as$/i, 'a'],
        [/oes$/i, 'ao'],
        [/ais$/i, 'al']
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

module.exports = {
    text: text,
    singular: singular
}