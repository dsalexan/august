const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery

module.exports = {

    alteracao_divulgacao_dia: (req, res, next) => {
        var dia = req.query.dia
        var id_divulgacao = req.query.id_divulgacao
        
        dados = [dia, id_divulgacao]

        const alteradia = new pq(sql.divulgacao.alteracao_divulgacao_dia)
       
        db.any(alteradia, dados)
        .then(v =>{
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },

    alteracao_divulgacao_hora: (req, res, next) => {
        var hora_inicio = req.query.hora_inicio
        var hora_fim = req.query.hora_fim
        var id_divulgacao = req.query.id_divulgacao
        
        dados = [hora_inicio, hora_fim, id_divulgacao]

        const alterahora = new pq(sql.divulgacao.alteracao_divulgacao_hora)
       
        db.any(alterahora, dados)
        .then(v =>{
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },

    busca_divulgacao_dia_hora: (req, res, next) => {
        var dia = req.query.dia
        var hora_inicio = req.query.hora_inicio
        
        dados = [dia, hora_inicio]

        const buscadiahora = new pq(sql.divulgacao.busca_divulgacao_dia_hora)
       
        db.any(buscadiahora, dados)
        .then(v =>{
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },

    busca_divulgacao_dia: (req, res, next) => {
        var dia = req.query.dia
        
        dados = [dia]

        const buscadia = new pq(sql.divulgacao.busca_divulgacao_dia)
       
        db.any(buscadia, dados)
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

    busca_divulgacao_hora: (req, res, next) => {
        var hora_inicio = req.query.ra_divulgacao
        dados = [hora_inicio]

        const buscahora = new pq(sql.divulgacao.busca_divulgacao_hora)
        
        db.any(buscahora, dados)
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

    busca_divulgacao_tipo_dia_hora: (req, res, next) => {
        var id_tipo = req.query.id_tipo
        var dia = req.query.dia
        var hora_inicio = req.query.hora_inicio

        dados = [id_tipo, dia, hora_inicio]

        const buscatipodiahora = new pq(sql.divulgacao.busca_divulgacao_tipo_dia_hora)
        
        db.any(buscatipodiahora, dados)
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

    busca_divulgacao_tipo_dia: (req, res, next) => {
        var id_tipo = req.query.id_tipo
        var dia = req.query.dia

        dados = [id_tipo, dia]

        const buscatipodia = new pq(sql.divulgacao.busca_divulgacao_tipo_dia)
        
        db.any(buscatipodiahora, dados)
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

    busca_divulgacao_tipo: (req, res, next) => {
        var id_tipo = req.query.id_tipo

        dados = [id_tipo]

        const buscatipo = new pq(sql.divulgacao.busca_divulgacao_tipo)
        
        db.any(buscatipo, dados)
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

    insert_divulgacao: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var id_tipo = req.query.id_tipo
        var valor = req.query.valor
        var dia = req.query.dia
        var hora_inicio = req.query.hora_inicio
        var hora_fim = req.query.hora_fim
        var descricao = req.query.descricao
        var quantidade = req.query.quantidade
        var reserva_automatica = req.query.reserva_automatica
        
        dados = [ra_aluno, id_tipo, valor, dia, hora_inicio, hora_fim, descricao, quantidade, reserva_automatica]

        const insertdivulgacao = new pq(sql.divulgacao.insert_divulgacao)
        db.none(insertdivulgacao, dados)
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

    remove_divulgacao: (req, res, next) => {
        var id_divulgacao = req.query.id_divulgacao

        dados = [id_divulgacao]

        const removedivulgacao = new pq(sql.divulgacao.remove_divulgacao)
        db.none(removedivulgacao, dados)
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
