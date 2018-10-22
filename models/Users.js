const db = require('../db')
const sql = require('./sql')


module.exports = {
    registerUnifesp: (username_unifesp, password_unifesp) => db.one('SELECT 9 AS id FROM test LIMIT 1'),
    registerUnifesp2: function(username_unifesp, password_unifesp){
        return new Promise((resolve, reject) => {
            db.one('SELECT 9 AS id FROM test LIMIT 1').then(result => {
                resolve(result, {username: 'us', password: 'ps'})
            }).catch(err => reject(err))
        })
    },

    findById: (id) => db.one('SELECT 9 AS id, \'dsalexandre\' AS username_unifesp FROM test LIMIT 1'),
    findByUsernameUnifesp: (username_unifesp) => db.oneOrNone('SELECT 9 AS id, \'dsalexandre\' AS username_unifesp FROM test WHERE id = -2 LIMIT 1') // SELECT ... AS usuario, ... AS senha
}