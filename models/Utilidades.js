const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    getSaldo: (req, res, next) => {
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
    getMatricula: (req, res, next) => {
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
    getCardapio: (req, res, next) => {
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
    getHistorico: (req, res, next) => {
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
    }
}