const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery
const pgp = require('pg-promise')


module.exports = {
    select_aluno_ra: (ra) => db.oneOrNone(sql.aluno.select_aluno_ra, {ra_aluno: ra}),
    select_alunos: () => db.any(sql.aluno.select_alunos),
    select_aluno_credenciais: (credenciais) => db.oneOrNone(sql.aluno.select_aluno_credenciais, credenciais),

    insert_aluno: (aluno) => db.none(sql.aluno.insert_aluno, aluno),

    // db.result para acessar numero de linhas alteradas
    update_email_aluno: (aluno) => db.result(sql.aluno.update_email_ra, aluno, r => r.rowCount),
    update_nome_aluno: (aluno) => db.result(sql.aluno.update_nome_ra, aluno, r => r.rowCount),
    update_credenciais_aluno: (aluno) => db.result(sql.aluno.update_credenciais_ra, aluno, r => r.rowCount),

    delete_aluno: (ra_aluno) => db.result(sql.aluno.delete_aluno, [ra_aluno], r => r.rowCount)
}
