var express = require('express')
var router = express.Router()

const { performance } = require('perf_hooks')
const _ = require('lodash')

const unifesp = require('../../libraries/unifesp')
const auth = require('../../auth/auth')
var Alunos = require('../../models/Alunos')
var Utilidades = require('../../models/Utilidades')

// GET 
router.get('/cardapio/', (req, res, next) => {
    var search = {
        data_solicitacao: req.query.data_solicitacao
    }

    unifesp.readCardapio(search).then(info => {
        if(info != null) {
            Utilidades.insertCardapio(info).then(() => {
                res.status(200).json({
                    status: 'success',
                    success: true
                })
            }).catch((err) => {
                res.status(200).json({
                    status: 'error',
                    success: false,
                    error: err
                })
            })
        } else {
            res.status(404).json({
                message: 'not Found',
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