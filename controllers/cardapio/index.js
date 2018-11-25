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
        data_solicitacao: formatDate(new Date())
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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = router