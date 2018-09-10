var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

const auth = require('../auth/auth')

var UnifespController = require('./UnifespController')

var Users = require('../models/Users')

// TODO: add winston logging to this
router.post('/login', function(req, res){
    var username = req.body.username
    var password = req.body.password // TODO: encriptar o password no outro lado da chamada usando um metodo 
                                     // conhecido para o servidor, assim mesmo que interceptem a chamada para a api
                                     // nao vao interceptar as credenciais do usuario

    if(username == undefined || password == undefined){
        res.status(400).send({
            auth: false,
            message: "Missing credentials."
        })
    }

    // fixar metodo para enviar dados já que ele é chamado em dois lugares
    const sendResult = function(user){
        var token = auth.token(user) // TODO: invalidar o token assim que o usuário executar logout no app? 
        // ou talvez colocar uma data de expiração e refazer o token a cada X dias?

        console.log(`Login successful for ${user.username_unifesp} with token: ${token}`)
        res.status(200).send({
            auth: true,
            token: token
        })
    }

    // auth/login vai funcionar como registro se nao houver conta de usuario com essas credenciais (válidas) ou como entrar caso contrario
    console.log(`Authenticating for ${username}...`)
    UnifespController.authenticateProxy(username, password, result => {
        if(result.auth){
            Users.findByUsernameUnifesp(username).then(user => {
                if(user == null){ // register user
                    console.log(`Registering ${username}...`)
                    Users.registerUnifesp(username).then(user => {
                        sendResult(user) // enviar resultado
                    }).catch(err => {
                        return next(err)
                    })
                }else{ // login user
                    sendResult(user) // enviar resultado
                }
            })
        }else{
            res.status(401).send({
                auth: false,
                message: 'Incorrect credentials'
            })
        }
    }, err => {
        return next(err)
    })
})

router.get('/me', auth.auth, function (req, res) {
    res.status(200).send(req.user)
})


module.exports = router