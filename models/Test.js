const db = require('../db')
const sql = require('./sql')

module.exports = {
    getTest: () => db.one(sql.test.get),
    addUser: (name, age) => db.none(sql.users.add, [name, age]),
    findUser: name => db.any(sql.users.search, name)
}