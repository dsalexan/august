const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery


module.exports = {
    registerUnifesp: (username_unifesp, password_unifesp) => {
        var ra_hash = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
        var dados = [ra_hash, '', username_unifesp, password_unifesp, '']
        var aluno = new pq(sql.aluno.insert_aluno, dados)
        return new Promise((resolve, reject) => {
            db.none(aluno, dados).then(result => {
                var aluno = new pq(sql.aluno.consultar_por_nome)
                db.any(aluno, [username_unifesp, password_unifesp]).then(a => {
                    resolve({exists: true, data: a})
                }).catch(err => reject(err))
            }).catch(err => reject(err))
        })
    },
    findById: (id) => db.one('SELECT 9 AS id, \'dsalexandre\' AS username_unifesp FROM test LIMIT 1'),
    findByUsernameUnifesp: (username_unifesp) => {
        var aluno = new pq('SELECT * FROM aluno WHERE login_intranet = $1')
        return new Promise((resolve, reject) => {
            db.any(aluno, [username_unifesp]).then(result => {
                if(result.length > 0) {
                    resolve({exists: true, data: result})
                } else {
                    resolve({exists: false})
                }
                console.log('RESULT',result)
            }).catch(err => reject(err))
        })
    }
}