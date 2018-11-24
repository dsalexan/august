const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery

module.exports = {
    insertBugReport: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var dia = req.query.dia
        var hora = req.query.hora
        var tipo = req.query.tipo
        var descricao = req.query.descricao
        dados = [ra_aluno, dia, hora, tipo, descricao]
        
        const bug = new pq(sql.bugreport.insert_bug_report);

        db.none(bug, dados).then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        }).catch(err => {
            console.log('ee', err)
            res.status(200).json({
                data: err,
                success: false
            })
        });
    }
}
