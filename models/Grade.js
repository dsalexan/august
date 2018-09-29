const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    teste: (req, res, next) => {
        var raTeste = '111111'
        dados = {ra_aluno: raTeste}

        const teste = new pq(sql.grade.select_grade_aluno_tq_idaluno);
        console.log(teste)
        
        db.any(teste.text, dados)
        .then(v => {
            console.log(v)
            // res.status(200).json({
            //     data: v,
            //     success: true
            // })
        })
        // .catch(error => {
        //     return next(error);
        // });
    }
}