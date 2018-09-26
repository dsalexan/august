const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    alteracao_email_aluno: (ra_aluno, email) => {
        const cleber = new pq(sql.alunos.alteracao_email_aluno);
        console.log(cleber)
        db.none(cleber, {email: email, ra_aluno: ra_aluno})
        .then(() =>{
            console.log(`Alteracao de email concluida para o aluno ${ra_aluno}`)
        })
        .catch(error => {
            console.log(error)
        });
    }
}
