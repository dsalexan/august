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
    searchViagemDataHoraLocal: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var local = req.query.local

        dados = [data, hora, local]
        
        const viagem = new pq(sql.caronas.srch_viagemDataHoraLocal);
        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error);
        });
    },
    searchViagemDataHora: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora

        dados = [data, hora]
        
        const viagem = new pq(sql.caronas.srch_viagemDataHora);
        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error);
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