var jwt = require('jsonwebtoken')

const Users = require('../models/Users')

var bcrypt = require('bcryptjs')

// para uma requisição para a api passar na autenticação é necessário:
// PRIMEIRO - fazer uma chamada com o username e o password da intranet, e guardar o token resultado
// SEGUNDO - fazer as requisições que quiser com o token na chave "x-access-token" dentro do header da chamada
// ex.: token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNTM2NTQ1MDA1fQ.2qi6ftHEquw1u2ncWPcaNCaPYAP4e6z_A3AqTOwx1AA
// duvidas sobre HEADERS e "x-access-token" e "chamadas" pesquisar: requisições HTTP, HTTP requests, chamadas HTTP
// eu uso o POSTMAN pra testar essas coisas, tem prints disso no trello

module.exports.auth = function(req, res, next){
    var token = req.headers['x-access-token']

    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    })
    
    
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) { // invalid token
            res.status(401).send({
                auth: false,
                message: 'Invalid token provided.'
            })
        }
        else{
            Users.findById(decoded.id).then(user =>{
                req.user = user
                next()
            }).catch(err => {
                next(err)
            })
        }
    })
    
}

module.exports.token = function(user){
    var token = jwt.sign({
        username: user.usuario,
        password: user.senha // Cripto.encrypt(user.senha)
    }, process.env.SECRET);
    // {
    //     expiresIn: 86400 // expires in 24 hours
    // })

    return token
}