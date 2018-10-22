const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery

module.exports = {
    deleteReserva: (req, res, next) => {
        var id = req.query.id
        dados = [id]

        const viagem = new pq(sql.caronas.del_reserva);
        
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
    deleteViagem: (req, res, next) => {
        var id = req.query.id
        dados = [id]

        const viagem = new pq(sql.caronas.del_viagem)
        
        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },    
    insertViagem: (req, res, next) => {
        var id_motorista = req.query.id_motorista
        var dia = req.query.dia
        var preco = req.query.preco
        var qtd_vagas = req.query.qtd_vagas
        var descricao = req.query.descricao
        
        dados = [id_motorista, dia, preco, qtd_vagas, descricao]

        const viagem = new pq(sql.caronas.ins_viagem);
        db.one(viagem, dados)
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
    insertOrigemViagem: (req, res, next) => {
        var id_viagem = req.query.id_viagem
        var hora = req.query.hora
        var origem = req.query.origem
        
        dados = [id_viagem, origem, hora]

        const viagem = new pq(sql.caronas.ins_viagem_origem);
        db.none(viagem, dados)
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
    insertDestinoViagem: (req, res, next) => {
        var id_viagem = req.query.id_viagem
        var destino = req.query.destino
        
        dados = [id_viagem, destino]

        const viagem = new pq(sql.caronas.ins_viagem_destino);
        db.none(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    searchViagemDataHora: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora

        dados = [data, hora]
        
        const viagem = new pq(sql.caronas.srch_viagemDataHora)
        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },   
    searchViagemDataHoraOrigemDestinoVagas: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var origem = req.query.origem
        var destino = req.query.destino
        var qtd_vagas = req.query.qtd_vagas
        
        dados = [data, hora, origem, destino, qtd_vagas]
        const viagem = new pq(sql.caronas.srch_viagemDataHoraOrigemDestinoVagas);
        
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
    searchViagemDataHoraOrigemDestino: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var origem = req.query.origem
        var destino = req.query.destino
        
        dados = [data, hora, origem, destino, qtd_vagas]
        const viagem = new pq(sql.caronas.srch_viagemDataHoraOrigemDestino);
        
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
    searchViagemDataHoraOrigem: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var origem = req.query.origem
        
        dados = [data, hora, origem]        
        const viagem = new pq(sql.caronas.srch_viagemDataHoraOrigem);

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
    searchViagemDataHoraDestino: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var destino = req.query.destino
        
        dados = [data, hora, destino]
        const viagem = new pq(sql.caronas.srch_viagemDataHoraDestino);

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
    searchViagemDataOrigem: (req, res, next) => {
        var data = req.query.data
        var origem = req.query.origem
        
        dados = [data, origem]
        const viagem = new pq(sql.caronas.srch_viagemDataOrigem);

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
    searchViagemDataDestino: (req, res, next) => {
        var data = req.query.data
        var destino = req.query.destino
        
        dados = [data, destino]
        const viagem = new pq(sql.caronas.srch_viagemDataDestino);
        
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
    searchViagemDataOrigemDestino: (req, res, next) => {
        var data = req.query.data
        var origem = req.query.origem
        var destino = req.query.destino
        
        dados = [data, hora, origem, destino]
        const viagem = new pq(sql.caronas.srch_viagemDataHoraOrigemDestino);

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
    searchViagemDataHoraOrigemVagas: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var origem = req.query.origem
        var qtd_vagas = req.query.qtd_vagas
        
        dados = [data, hora, origem, qtd_vagas]
        const viagem = new pq(sql.caronas.srch_viagemDataHoraOrigemVagas);

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
    searchViagemDataHoraDestinoVagas: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var destino = req.query.destino
        var qtd_vagas = req.query.qtd_vagas
        
        dados = [data, hora, destino, qtd_vagas]
        const viagem = new pq(sql.caronas.srch_viagemDataHoraDestinoVagas);

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
    searchViagemDataHoraVagas: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var qtd_vagas = req.query.qtd_vagas
        
        dados = [data, hora, qtd_vagas]
        const viagem = new pq(sql.caronas.srch_viagemDataHoraVagas);
        
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
    searchViagemDataVagas: (req, res, next) => {
        var data = req.query.data
        var qtd_vagas = req.query.qtd_vagas
        
        dados = [data, qtd_vagas]        
        const viagem = new pq(sql.caronas.srch_viagemDataVagas);

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
    searchViagemData: (req, res, next) => {
        var data = req.query.data
        
        dados = [data]
        const viagem = new pq(sql.caronas.srch_viagemData);

        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    searchViagemMotorista: (req, res, next) => {
        var id = req.query.id
        dados = [id]
        
        const viagem = new pq(sql.caronas.srch_viagemMotorista)
        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },   
    searchViagemPassageiro: (req, res, next) => {
        var id = req.query.id
        dados = [id]

        const viagem = new pq(sql.caronas.srch_viagemPassageiro)
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
    searchReserva: (req, res, next) => {
        var id = req.query.id
        dados = [id]

        const viagem = new pq(sql.caronas.srch_reserva);
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
    selectLocalidadeDescricao: (req, res, next) => {
        const localidades = new pq(sql.caronas.select_localidades)
        db.any(localidades)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    solicitarReserva: (req, res, next) => {
        var id_viagem = req.query.id_viagem
        var id_passageiro = req.query.id_passageiro
        var status_reserva = req.query.status_reserva
        dados = [id_viagem, id_passageiro, status_reserva]

        const viagem = new pq(sql.caronas.solic_reserva)
        db.none(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    updateDiaViagem: (req, res, next) => {
        var dia = req.query.dia
        var id = req.query.id  
        dados = [dia, id]

        const viagem = new pq(sql.caronas.update_viagemDia)
        db.none(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },   
    updateHorarioViagem: (req, res, next) => {
        var hora = req.query.hora
        var id = req.query.id 
        dados = [hora, id]

        const viagem = new pq(sql.caronas.update_viagemHorario)
        db.none(viagem, dados)
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
    updateStatusReserva: (req, res, next) => {
        var id = req.query.id
        dados = ['true', id]

        const viagem = new pq(sql.caronas.update_statusReserva);
        db.none(viagem, dados)
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
    getAllCaronas: (req, res, next) => {
        var id = req.query.id
        dados = [id]
        const viagem = new pq(sql.caronas.get_all)
        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    }
}