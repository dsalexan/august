const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery
const pgp = require('pg-promise')

Professores = {}

Professores.insert_professor = (prof) => db.none(sql.professor.insert_professor, prof)

module.exports = Professores