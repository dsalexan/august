const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    deleteViagem: (id) => {
        const viagem = new pq(sql.caronas.del_viagem);
        db.any(viagem, [id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    }
}