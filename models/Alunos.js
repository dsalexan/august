const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    alteracao_email_aluno: (ra_aluno, email) => {
        const alteremail = new pq(sql.alunos.alteracao_email_aluno);
        console.log(alteremail)
        db.none(alteremail, {email: email, ra_aluno: ra_aluno})
        .then(() =>{
            console.log(`Alteracao de email concluida para o aluno ${ra_aluno}.`)
        })
        .catch(error => {
            console.log(error)
        });
    },

    alteracao_nome_aluno: (ra_aluno, nome) => {
        const alternome = new pq(sql.alunos.alteracao_nome_aluno);
        console.log(alternome)
        db.any(alternome, {nome: nome, ra_aluno: ra_aluno})
        .then(() => {
            console.log(`Alteracao de nome concluida para o aluno ${nome}`)
        })
        .catch(error => {
            console.log(error)
        });
    },

    consulta_aluno: (ra_aluno) => {
        const consaluno = new pq(sql.alunos.consulta_aluno);
        console.log(consaluno)
        db.any(consaluno, {ra_aluno: ra_aluno})
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },

    insert_aluno: (ra_aluno, nome, login_intranet, email) => {
        const inseraluno = new pq(sql.alunos.insert_aluno);
        console.log(inseraluno)
        db.any(inseraluno, {ra_aluno: ra_aluno, nome:nome, login_intranet:login_intranet, email:email})
        .then(v => {
            console.log(`Insercao do aluno ${nome} realizada com sucesso.`)
        })
        .catch(error => {
            console.log(error)
        });
    },

    remove_aluno: (ra_aluno) => {
        const removaluno = new pq(sql.alunos.remove_aluno);
        console.log(removaluno)
        db.any(removaluno, {ra_aluno: ra_aluno})
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    }
}
