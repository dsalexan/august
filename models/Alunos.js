const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery
const pgp = require('pg-promise')


Alunos = {}

Alunos.select_aluno_ra = (ra) => db.oneOrNone(sql.aluno.select_aluno_ra, {ra_aluno: ra})
Alunos.select_alunos = () => db.any(sql.aluno.select_alunos)
Alunos.select_aluno_credenciais = (credenciais) => db.oneOrNone(sql.aluno.select_aluno_credenciais, credenciais)
Alunos.select_aluno_login = (login_intranet) => db.oneOrNone(sql.aluno.select_aluno_login, [login_intranet])

Alunos.insert_aluno = (aluno) => db.none(sql.aluno.insert_aluno, aluno)

// db.result para acessar numero de linhas alteradas
Alunos.update_email_aluno = (aluno) => db.result(sql.aluno.update_email_ra, aluno, r => r.rowCount)
Alunos.update_nome_aluno = (aluno) => db.result(sql.aluno.update_nome_ra, aluno, r => r.rowCount)
Alunos.update_credenciais_aluno = (aluno) => db.result(sql.aluno.update_credenciais_ra, aluno, r => r.rowCount)

Alunos.delete_aluno = (ra_aluno) => db.result(sql.aluno.delete_aluno, [ra_aluno], r => r.rowCount)


// SUPER MODELS
Alunos.register_aluno = (ra_aluno, nome, username_unifesp) => {
    var dados = {
        ra_aluno: ra_aluno,
        nome: nome,
        login_intranet: username_unifesp,
        email: ''
    }
    return new Promise((resolve, reject) => {
        Alunos.insert_aluno(dados).then(() => {
            db.one(sql.aluno.select_aluno_credenciais, {
                login_intranet: dados.login_intranet
            }).then(a => {
                resolve({exists: true, data: a})
            }).catch(err => reject(err))
        })
    })
}

Alunos.check_register_aluno = (username_unifesp) => {
    return new Promise((resolve, reject) => {
        Alunos.select_aluno_login(username_unifesp).then(result => {
            resolve({
                exists: result != null,
                data: result
            })
        }).catch(err => reject(err))
    })
}


module.exports = Alunos
