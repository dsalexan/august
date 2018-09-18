const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

const viagem1 = new pq(sql.caronas.srch_viagemDataHoraLocal);
const viagem2 = new pq(sql.caronas.srch_viagemDataHora);
const localidades = new pq(sql.caronas.select_localidades);

module.exports = {
    searchViagemDataHoraLocal: (d, h, l) => {
        
        db.one(viagem1, [d, h, l])
        .then(v => {
            console.log(v.id_viagem)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemDataHora: (d, h) => {
        db.one(viagem2, [d, h])
        .then(v => {
            console.log(v.id_viagem)
        })
        .catch(error => {
            console.log(error)
        });
    },
    selectLocalidadeDescricao: () => {
        
        db.one(localidades)
        .then(l => {
            console.log(l)
        })
        .catch(error => {
            console.log(error)
        });
    },
}




//module.exports = {
    //searchViagemDataHoraLocal: (d, h, l) => db.any(sql.caronas.srch_viagemDataHoraLocal, [d, h, l]),
    //addUser: (name, age) => db.none(sql.users.add, [name, age]),
    //findUser: name => db.any(sql.users.search, name)

    //registerUnifesp: (username_unifesp, password_unifesp) => db.one("SELECT 9 AS id FROM test LIMIT 1"),

    //findById: (id) => db.one("SELECT 9 AS id, 'dsalexandre' AS username_unifesp FROM test LIMIT 1"),
    //findByUsernameUnifesp: (username_unifesp) => db.oneOrNone("SELECT 9 AS id, 'dsalexandre' AS username_unifesp FROM test WHERE id = -2 LIMIT 1")
//}