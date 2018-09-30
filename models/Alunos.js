const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    getAluno: (req, res, next) => {
        var login = req.params.login
        var senha = req.params.senha

        var aluno = new pq(sql.aluno.consultar_por_nome);
        db.any(aluno, [login, senha])
        .then(a => {
            res.status(200).json({
                status: 'success',
                data: a
            });
        })
        .catch(error => {
            return next(error);
        });
    },

    alteracao_email_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var email = req.query.email
        
        dados = [email, ra_aluno]

        const alteremail = new pq(sql.aluno.alteracao_email_aluno);
       
        db.any(alteremail, dados)
        .then(v =>{
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error);
        });
    },

    alteracao_nome_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var nome = req.query.nome
        
        dados = [nome, ra_aluno]

        const alternome = new pq(sql.aluno.alteracao_nome_aluno);
       
        db.any(alternome, dados)
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

    consulta_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        dados = [ra_aluno]

        const consaluno = new pq(sql.aluno.consulta_aluno);
        
        db.any(consaluno, dados)
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

    insert_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var nome = req.query.nome
        var login_intranet = req.query.login_intranet
        var senha_intranet = req.query.senha_intranet
        var email = req.query.email
        
        dados = [ra_aluno, nome, login_intranet, senha_intranet, email]

        const inseraluno = new pq(sql.aluno.insert_aluno);
        db.none(inseraluno, dados)
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

    remove_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = [ra_aluno]

        const removaluno = new pq(sql.aluno.remove_aluno);
        db.none(removaluno, dados)
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
