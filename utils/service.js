const Unifesp = require('../models/Unifesp')

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

module.exports = {
    delay: delay,
    waitFor: waitFor
}