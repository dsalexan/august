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

    alteracao_divulgacao_quantidade: (req, res, next) => {
        var quantidade = req.query.quantidade
        var id_divulgacao = req.query.id_divulgacao
        
        dados = [quantidade, id_divulgacao]

        const alteraquantidade = new pq(sql.divulgacao.alteracao_divulgacao_quantidade)
       
        db.any(alteraquantidade, dados)
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

   setar_quantidade: (req, res, next) => {
       var id_divulgacao = req.query.id_divulgacao
        var quantidade = req.query.quantidade
        
        dados = [id_divulgacao, quantidade]

        const setarquantidade = new pq(sql.divulgacao.setar_quantidade)
       
        db.any(setarquantidade, dados)
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

    busca_divulgacao_dia_hora_inicio: (req, res, next) => {
        var dia = req.query.dia
        var hora_inicio = req.query.hora_inicio
        
        dados = [dia, hora_inicio]

        const buscadiahorainicio = new pq(sql.divulgacao.busca_divulgacao_dia_hora_inicio)
       
        db.any(buscadiahorainicio, dados)
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

    busca_divulgacao_dia_hora_fim: (req, res, next) => {
        var dia = req.query.dia
        var hora_fim = req.query.hora_fim
        
        dados = [dia, hora_fim]

        const buscadiahorafim = new pq(sql.divulgacao.busca_divulgacao_dia_hora_fim)
       
        db.any(buscadiahorafim, dados)
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

    busca_divulgacao_dia_preco: (req, res, next) => {
        var dia = req.query.dia
        var preco = req.query.preco
        
        dados = [dia, preco]

        const buscadiapreco = new pq(sql.divulgacao.busca_divulgacao_dia_preco)
       
        db.any(buscadiapreco, dados)
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

    busca_divulgacao_dia_quantidade: (req, res, next) => {
        var dia = req.query.dia
        var quantidade = req.query.quantidade
        
        dados = [dia, quantidade]

        const buscadiaquantidade = new pq(sql.divulgacao.busca_divulgacao_dia_quantidade)
       
        db.any(buscadiaquantidade, dados)
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
        var hora_inicio = req.query.hora_inicio
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

    busca_divulgacao_preco: (req, res, next) => {
        var preco = req.query.preco
        
        dados = [preco]

        const buscapreco = new pq(sql.divulgacao.busca_divulgacao_preco)
       
        db.any(buscapreco, dados)
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

    busca_divulgacao_tipo_preco: (req, res, next) => {
        var tipo = req.query.tipo
        var preco = req.query.preco
        
        dados = [tipo, preco]

        const buscatipopreco = new pq(sql.divulgacao.busca_divulgacao_tipo_preco)
       
        db.any(buscatipopreco, dados)
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

    busca_divulgacao_tipo_quantidade: (req, res, next) => {
        var tipo = req.query.tipo
        var quantidade = req.query.quantidade
        
        dados = [tipo, quantidade]

        const buscatipoquantidade = new pq(sql.divulgacao.busca_divulgacao_tipo_quantidade)
       
        db.any(buscatipoquantidade, dados)
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

    busca_divulgacao: (req, res, next) => {
       
        
        const buscadivulgacao = new pq(sql.divulgacao.busca_divulgacao)
        
        db.any(buscadivulgacao)
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

    busca_divulgacao_quantidade: (req, res, next) => {
        var quantidade = req.query.quantidade

        dados = [quantidade]

        const buscaquantidade = new pq(sql.divulgacao.busca_divulgacao_quantidade)
        
        db.any(buscaquantidade, dados)
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

    select_tipo: (req, res, next) => {
        const tipo_divulgacao = new pq(sql.divulgacao.select_tipo)
        db.any(tipo_divulgacao)
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

    busca_divulgacao_vendedor_ra_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = [ra_aluno]
       
        const buscavendedorraaluno = new pq(sql.divulgacao.busca_divulgacao_vendedor_ra_aluno)
        
        db.any(buscavendedorraaluno, dados)
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

    busca_divulgacao_comprador_ra_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = [ra_aluno]
       
        const buscacompradorraaluno = new pq(sql.divulgacao.busca_divulgacao_comprador_ra_aluno)
        
        db.any(buscacompradorraaluno, dados)
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

    busca_divulgacao_reservas: (req, res, next) => {
        var id_divulgacao = req.query.id_divulgacao

        dados = [id_divulgacao]
       
        const buscareservas= new pq(sql.divulgacao.busca_divulgacao_reservas)
        
        db.any(buscareservas, dados)
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

    remove_divulgacao_reservas: (req, res, next) => {
        var id_reserva = req.query.id_reserva

        dados = [id_reserva]
       
        const removereserva = new pq(sql.divulgacao.remove_divulgacao_reservas)
        
        db.any(removereserva, dados)
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

    remove_divulgacao_todas_reservas: (req, res, next) => {
        var id_divulgacao = req.query.id_divulgacao

        dados = [id_divulgacao]
        console.log(dados)
       
        const removetodasreserva = new pq(sql.divulgacao.remove_divulgacao_todas_reservas)
        
        db.any(removetodasreserva, dados)
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
        console.log('OI', req.query)
        console.log('ra', ra_aluno)
        var ra_aluno = req.query.ra_aluno
        var id_tipo = req.query.id_tipo
        var nome = req.query.nome
        var valor = req.query.valor
        var dia = req.query.dia
        var hora_inicio = req.query.hora_inicio
        var hora_fim = req.query.hora_fim
        var descricao = req.query.descricao
        var quantidade = req.query.quantidade
        
        dados = [ra_aluno, id_tipo, nome, valor, dia, hora_inicio, hora_fim, descricao, quantidade]

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
    },

    insert_reserva_divulgacao: (req, res, next) => {
        var id_divulgacao = req.query.id_divulgacao
        var ra_aluno_comprador = req.query.ra_aluno_comprador
        var quantidade = req.query.quantidade
        var status_reserva = req.query.status_reserva
        
        dados = [id_divulgacao, ra_aluno_comprador, quantidade, status_reserva]

        const insertreservadivulgacao = new pq(sql.divulgacao.insert_reserva_divulgacao)
        db.none(insertreservadivulgacao, dados)
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
    