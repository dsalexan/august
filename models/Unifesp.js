const db = require('../db')
const sql = require('../queries')

Unifesp = {}

Unifesp.select_extracao_latest = (extracao) => db.oneOrNone(sql.unifesp.select_extracao_latest, {extracao: extracao})
Unifesp.select_ementas = () => Unifesp.select_extracao_latest('ementas')
Unifesp.select_agenda = () => Unifesp.select_extracao_latest('agenda')

Unifesp.select_ucs = () => db.any(sql.unifesp.select_ucs)
Unifesp.select_uc = (hash) => db.oneOrNone(sql.unifesp.select_uc, [hash])
Unifesp.select_alias_uc = (hash) => db.any(sql.unifesp.select_alias_uc, [hash])
Unifesp.select_ucs_not_hash = (hashes) => db.any(sql.unifesp.select_ucs_not_hash, [hashes])
Unifesp.select_analise_latest = (extracao) => db.oneOrNone(sql.unifesp.select_analise_latest, [extracao])
Unifesp.select_uc_alias = (alias) => db.any(sql.unifesp.select_uc_alias, [alias])
Unifesp.select_uc_nome = (nome) => db.any(sql.unifesp.select_uc_nome, [nome])

Unifesp.select_aula_hash = (hash) => db.oneOrNone(sql.unifesp.select_aula_hash, [hash])

Unifesp.insert_extracao = (data) => db.one(sql.unifesp.insert_extracao, data)

Unifesp.insert_uc = (data) => db.none(sql.unifesp.insert_uc, data)
Unifesp.insert_alias = (data) => db.none(sql.unifesp.insert_alias, data)
Unifesp.insert_analise = (data) => db.one(sql.unifesp.insert_analise, data)
Unifesp.insert_sala = (data) => db.one(sql.unifesp.insert_sala, data)
Unifesp.insert_aula = (data) => db.none(sql.unifesp.insert_aula, data)
Unifesp.insert_reserva = (data) => db.none(sql.unifesp.insert_reserva, data)

Unifesp.update_uc_hash = (uc) => db.none(sql.unifesp.update_uc_hash, uc)
Unifesp.update_analise = (analise) => db.none(sql.unifesp.update_analise, analise)

Unifesp.delete_uc_hash = (hash) => db.none(sql.unifesp.delete_uc_hash, [hash])
Unifesp.delete_alias = (data) => db.none(sql.unifesp.delete_alias_id, data)

Unifesp.register_uc = (uc) => {
    return new Promise((resolve, reject) => {
        Unifesp.insert_uc(uc).then(() => {
            let p = []
            for(let alias of uc.aliases){
                p.push(Unifesp.insert_alias({
                    hash_uc: uc.hash,
                    alias: alias
                }))
            }
    
            Promise.all(p).then(() => {
                resolve()
            }).catch(err => {
                console.log('alias', err)
                reject(err)
            })
        }).catch(err => {
            console.log('uc', err)
            reject(err)
        })
    })
}

Unifesp.update_uc = (uc) => {
    return new Promise((resolve, reject) => {
        
        if(uc.hash == 265879372){
            asdasd = 1
        }
        
        Unifesp.update_uc_hash(uc).then(() => {
            Unifesp.select_alias_uc(uc.hash).then(aliases => {
                let only_aliases = aliases.map(a => a.alias)
                let p = []
                for(let alias of uc.aliases){
                    if(!only_aliases.includes(alias)){
                        p.push(Unifesp.insert_alias({
                            hash_uc: uc.hash,
                            alias: alias
                        }))
                    }
                }

                for(let alias of aliases){
                    if(!uc.aliases.includes(alias.alias)){
                        p.push(Unifesp.delete_alias(alias))
                    }
                }

                Promise.all(p).then(() => {
                    resolve()
                }).catch(err => {
                    console.log('update aliases', err)
                    reject(err)
                })
            }).catch(err => {
                console.log('select aliases uc', err)
                reject(err)
            })
        }).catch(err => {
            console.log('update uc', err)
            reject(err)
        })
    })
}


module.exports = Unifesp