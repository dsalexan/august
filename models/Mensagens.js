const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery

module.exports = {
    insert_msg: (req, res, next) => {
        var id_destinatario = req.query.id_destinatario
        var msg = req.query.msg

        dados = [id_destinatario, msg, false]
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
    get_all_msgs: (req, res, next) => {
        var id_destinatario = req.query.id_destinatario
        
        dados = [id_destinatario]
        const viagem = new pq(sql.mensagens.get_all_msgs)

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
}