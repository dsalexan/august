const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    deleteViagem: (req, res, next) => {
        var id = req.query.id
        dados = [id]

        const viagem = new pq(sql.caronas.del_viagem);
        
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
    insertViagem: (req, res, next) => {
        var id_motorista = req.query.id_motorista
        var id_origem = req.query.id_origem
        var id_destino = req.query.id_destino
        var dia = req.query.dia
        var hora = req.query.hora
        var preco = req.query.preco
        var qtd_vagas = req.query.qtd_vagas
        var descricao = req.query.descricao
        
        dados = [id_motorista, id_origem, id_destino, dia, hora, preco, qtd_vagas, descricao]

        const viagem = new pq(sql.caronas.ins_viagem);
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
    searchViagemMotorista: (req, res, next) => {
        var id = req.query.id
        dados = [id]
        
        const viagem = new pq(sql.caronas.srch_viagemMotorista);
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
    searchViagemPassageiro: (req, res, next) => {
        var id = req.query.id
        dados = [id]

        const viagem = new pq(sql.caronas.srch_viagemPassageiro);
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
        const localidades = new pq(sql.caronas.select_localidades);
        db.any(localidades)
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
    updateDiaViagem: (req, res, next) => {
        var dia = req.query.dia
        var id = req.query.id  
        dados = [dia, id]

        const viagem = new pq(sql.caronas.update_viagemDia);
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
    updateHorarioViagem: (req, res, next) => {
        var hora = req.query.hora
        var id = req.query.hora 
        dados = [dia, hora]

        const viagem = new pq(sql.caronas.update_viagemHorario);
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
        const viagem = new pq(sql.caronas.get_all);
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
    }
}