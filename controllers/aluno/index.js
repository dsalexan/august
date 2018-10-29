var express = require('express')
var router = express.Router()

const { performance } = require('perf_hooks')
const _ = require('lodash')

const auth = require('../../auth/auth')
var Alunos = require('../../models/Alunos');

// GET api/alunos/<ra_aluno> <- retorna um aluno especifico
// GET api/alunos <- retorna todos os alunos OR alunos que passem nos parametros especificos
//      GET api/alunos?a=valor;b=value;c=bravura
// POST api/alunos/ <- insere um novo aluno
// PUT api/alunos/<ra_aluno> <- atualiza as informações de um aluno
// DELETE api/alunos/<ra_aluno> <- remove um aluno especifico do banco

// GET 
router.get('/alunos/', (req, res, next) => {
    var search = {
        login_intranet: req.query.login_intranet,
        senha_intranet: req.query.senha_intranet
    }

    var fn = Alunos.select_alunos
    if(search.login_intranet && search.senha_intranet){
        fn = Alunos.select_aluno_credenciais
    }

    fn(search)
    .then(a => {
        if(a != null){
            res.status(200).json({
                status: 'success',
                data: a
            })
        }else{
            res.status(404).json({
                message: "Not Found",
                success: false
            })
        }
    })
    .catch(error => {
        return next(error)
    })
})

router.get('/alunos/:ra_aluno', (req, res, next) => {
    var ra_aluno = req.params.ra_aluno

    Alunos.select_aluno_ra(ra_aluno)
    .then(v => {
        if(v != null){
            res.status(200).json({ // retornando estato 200 OK para objeto encontrado
                data: v,
                success: true
            })
        }else{
            res.status(404).json({ // retornando estado 404 NOT FOUND para objeto nao encontrado
                message: "Not Found",
                success: false
            })
        }
    })
    .catch(error => {
        return next(error)
    })
})

// POST
router.post('/alunos', (req, res, next) => {
    var aluno = {
        ra_aluno: req.body.ra_aluno,
        nome: req.body.nome,
        login_intranet: req.body.login_intranet,
        senha_intranet: req.body.senha_intranet,
        email: req.body.email,
    }

    Alunos.insert_aluno(aluno)
    .then(v => {
        res.status(200).json({
            data: v,
            success: true
        })
    })
    .catch(error => {
        return next(error)
    })
})

// PUT
router.put('/alunos/:ra_aluno', (req, res, next) => {
    var aluno = {
        ra_aluno: req.params.ra_aluno,
        email: req.body.email,
        nome: req.body.nome,
        login_intranet: req.body.login_intranet,
        senha_intranet: req.body.senha_intranet
    }

    var updates = []
    if(aluno.email) updates.push(Aluno.update_email_aluno(aluno))
    if(aluno.nome) updates.push(Alunos.update_nome_aluno(aluno))
    if(aluno.login_intranet && aluno.senha_intranet) updates.push(Alunos.update_credenciais_aluno(aluno))

    Promise.all(updates)
    .then(rowCounts =>{
        res.status(200).json({
            rows: rowCounts.reduce((soma, rowCountAtual) => soma + rowCountAtual, 0),
            success: true
        })
    })
    .catch(error => {
        return next(error)
    })
})

// DELETE
router.delete('/alunos/:ra_aluno', (req, res, next) => {
    var ra_aluno = req.params.ra_aluno

    Alunos.delete_aluno(ra_aluno)
    .then(rowCount => {
        res.status(200).json({
            rows: rowCount,
            success: true
        })
    })
    .catch(error => {
        return next(error)
    })
})

module.exports = router