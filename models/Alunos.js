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
            console.log(error)
        });
    },

    alteracao_email_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var email = req.query.email
        
        dados = [email, ra_aluno]

        const alteremail = new pq(sql.aluno.alteracao_email_aluno);
        console.log(alteremail)
        db.any(alteremail, dados)
        .then(v =>{
            res.status(200).json({
                data: v,
                success: true
            })
            //console.log(`Alteracao de email concluida para o aluno ${email}.`)
        })
        .catch(error => {
            console.log(error)
        });
    },

    alteracao_nome_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var nome = req.query.nome
        
        dados = [nome, ra_aluno]

        const alternome = new pq(sql.aluno.alteracao_nome_aluno);
        console.log(alternome)
        db.any(alternome, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            console.log(error)
        });
    },

    consulta_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        dados = [ra_aluno]

        const consaluno = new pq(sql.aluno.consulta_aluno);
        console.log(consaluno)
        db.any(consaluno, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            console.log(error)
        });
    },

    insert_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var nome = req.query.nome
        var login_intranet = req.query.login_intranet
        var email = req.query.email
        
        dados = [ra_aluno, nome, login_intranet, email]

        const inseraluno = new pq(sql.alunos.insert_aluno);
        console.log(inseraluno)
        db.none(inseraluno, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
            console.log(`Insercao do aluno ${nome} realizada com sucesso.`)
        })
        .catch(error => {
            console.log(error)
        });
    },

    remove_aluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = [ra_aluno]

        const removaluno = new pq(sql.aluno.remove_aluno);
        console.log(removaluno)
        db.any(removaluno, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    }
}
