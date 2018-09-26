const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    deleteViagem: (id) => {
        const viagem = new pq(sql.caronas.del_viagem);
        db.any(viagem, [id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    insertViagem: (id_motorista, id_origem, id_destino, dia, hora, preco, qtd_vagas, descricao) => {
        const viagem = new pq(sql.caronas.ins_viagem);
        db.none(viagem, [id_motorista, id_origem, id_destino, dia, hora, preco, qtd_vagas, descricao])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemDataHoraLocal: (d, h, l, res, next) => {
        const viagem = new pq(sql.caronas.srch_viagemDataHoraLocal);
        db.any(viagem, [d, h, l])
        .then(v => {
            // console.log(v)
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            //console.log(error)
            res.status(200).json({
                success: false
            })
        });
    },
    searchViagemDataHora: (d, h) => {
        const viagem = new pq(sql.caronas.srch_viagemDataHora);
        db.any(viagem, [d, h])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemMotorista: (id) => {
        const viagem = new pq(sql.caronas.srch_viagemMotorista);
        db.any(viagem, [id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemPassageiro: (id) => {
        const viagem = new pq(sql.caronas.srch_viagemPassageiro);
        db.any(viagem, [id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    selectLocalidadeDescricao: () => {
        const localidades = new pq(sql.caronas.select_localidadesDescricao);
        db.any(localidades)
        .then(l => {
            console.log(l)
        })
        .catch(error => {
            console.log(error)
        });
    },
    selectLocalidade: (descricao) => {
        const viagem = new pq(sql.caronas.select_localidade);
        db.oneOrNone(viagem, [descricao])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    updateDiaViagem: (novo, id) => {
        const viagem = new pq(sql.caronas.update_viagemDia);
        db.none(viagem, [novo, id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    updateHorarioViagem: (novo, id) => {
        const viagem = new pq(sql.caronas.update_viagemHorario);
        db.none(viagem, [novo, id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    getAllCaronas: (req, res, next) => {
        var id = req.params.id
        console.log('ID',req.params.id)
        const viagem = new pq(sql.caronas.get_all);
        db.any(viagem, [id])
        .then(v => {
            res.status(200)
                .json({
                    status: 'success',
                    data: v
                });
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