const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery

module.exports = {
    insertBugReport: (req, res, next) => {
        var ra_aluno = req.body.ra_aluno
        var dia = req.body.dia
        var hora = req.body.hora
        var tipo = req.body.tipo
        var descricao = req.body.descricao
        dados = [ra_aluno, dia, hora, tipo, descricao]
        
        const bug = new pq(sql.bugreport.insert_bug_report);

        db.none(bug, dados).then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        }).catch(err => {
            res.status(200).json({
                data: err,
                success: false
            })
        });
    }
}
