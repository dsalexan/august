var express = require('express')
var router = express.Router()

const { performance } = require('perf_hooks')
const _ = require('lodash')

const unifesp = require('../../libraries/unifesp')
const auth = require('../../auth/auth')
var Alunos = require('../../models/Alunos')

// GET api/alunos/<ra_aluno> <- retorna um aluno especifico
// GET api/alunos <- retorna todos os alunos OR alunos que passem nos parametros especificos
//      GET api/alunos?a=valor;b=value;c=bravura
// POST api/alunos/ <- insere um novo aluno
// PUT api/alunos/<ra_aluno> <- atualiza as informações de um aluno
// DELETE api/alunos/<ra_aluno> <- remove um aluno especifico do banco

// GET 
router.get('/cardapio/', (req, res, next) => {
    var search = {
        data_solicitacao: req.query.data_solicitacao
    }

    unifesp.readCardapio(search).then(a => {
        if(a != null) {
            res.status(200).json({
                status: 'success',
                data: a
            })
        } else {
            res.status(404).json({
                message: 'Not Found',
                success: false
            })
        }
    }).catch(error => {
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

module.exports = router