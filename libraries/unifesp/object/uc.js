const simplify = require('../../../utils/simplify')
const Alias = require('./alias')

function checkRequisites_Helper(requisite, list){
    let match = list[requisite]
    if(match){
        if(match.length > 1){
            console.log(undefined, 'Too many correspondences', requisite, match)
            return [undefined, [undefined, 'Too many correspondences', requisite, match]]
        }else{
            return [match[0], undefined]
        }
    }else{
        let unq = unqualifier(requisite)
        match = list[unq]
        if(match){
            if(match.length > 1){
                console.log(undefined, 'Too many correspondences', unq, match)
                return [undefined, [undefined, 'Too many correspondences', requisite, match]]
            }else{
                return [match[0], undefined]
            }
        }else{
            return [undefined, undefined]
        }
    }
}

function irregular(text){
    return text.replace(/^(M|m)ateriais (C|c)er(â|a)micas$/, '$1ateriais $2er$3micos')
}

function unqualifier(text){
    return text.replace(/(xi{0,4}|vi{0,4}|i{1,4}v?)$/gi, '').trim()
}

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

    hashRequisites(listOfAliases){
        let hashed = []
        let errors = []

        let fila = [...this.requisitos]
        while(fila.length > 0){
            let requisito = fila.pop()
            let simple = irregular(simplify.text(requisito))
            if(simple == '') continue

            let [result, err] = checkRequisites_Helper(simple, listOfAliases)
            err && errors.push(err)
            if(result){
                hashed.push(result)
            }else{
                let noStopwords = simple.split(' ').filter(word => !simplify.stopword(word)).join(' ')

                if(noStopwords == undefined){
                    tops = `1`
                }
                [result, err] = checkRequisites_Helper(noStopwords, listOfAliases)
                err && errors.push(err)

                if(result){
                    hashed.push(result)
                }else{
                    if(requisito.match(/ e /gi)){
                        for(let v of requisito.split(/ e /gi)){
                            simple = irregular(simplify.text(v))
                            [result, err] = checkRequisites_Helper(simple, listOfAliases)
                            err && errors.push(err)

                            if(result){
                                hashed.push(result)
                            }else{
                                noStopwords = simple.split(' ').filter(word => !simplify.stopword(word)).join(' ')
                                
                                [result, err] = checkRequisites_Helper(noStopwords, listOfAliases)
                                err && errors.push(err)

                                if(result){
                                    hashed.push(result)
                                }else{
                                    console.log(undefined, this.hash, this.id, 'No correspondences (with or without stopwords)', simple, result)
                                    errors.push([undefined, this.hash, this.id, 'No correspondences (with or without stopwords)', simple, result])
                                }
                            }
                        }
                    }else{
                        console.log(undefined, this.hash, this.id, 'No correspondences (with or without stopwords)', simple, result)
                        errors.push([undefined, this.hash, this.id, 'No correspondences (with or without stopwords)', simple, result])
                    }
                }
            }
        }

        this.requisitos = hashed
        return errors
    }

    fromSummary(summary, id_analise){
        this.summary = summary
        this.id_analise = id_analise

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

UC.irregular = irregular


module.exports = UC