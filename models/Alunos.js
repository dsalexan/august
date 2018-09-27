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
    }
}