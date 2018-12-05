const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery

module.exports = {
    insert_msg: (req, res, next) => {
        var id_destinatario = req.query.id_destinatario
        var msg = req.query.msg
        var dia = req.query.dia
        var hora = req.query.hora

        dados = [id_destinatario, msg, false, dia, hora]
        const viagem = new pq(sql.mensagens.insert_msg)

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
    get_read_msgs: (req, res, next) => {
        var id_destinatario = req.query.id_destinatario
        
        dados = [id_destinatario]
        const viagem = new pq(sql.mensagens.get_read_msgs)

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
    get_nonread_msgs: (req, res, next) => {
        var id_destinatario = req.query.id_destinatario
        
        dados = [id_destinatario]
        const viagem = new pq(sql.mensagens.get_nonread_msgs)

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
    delete_msg: (req, res, next) => {
        var id_mensagem = req.params.id_mensagem
        
        dados = [id_mensagem]
        const viagem = new pq(sql.mensagens.delete_msg)

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
    alterar_status_msg: (req, res, next) => {
        var id_mensagem = req.params.id_mensagem
        
        dados = [id_mensagem]
        const viagem = new pq(sql.mensagens.alterar_status_msg)

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
}