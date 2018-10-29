var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({
    extended: false
}))
router.use(bodyParser.json())

const auth = require('../auth/auth')

var UnifespController = require('./UnifespController')

var Users = require('../models/Users')

const { performance } = require('perf_hooks')

// Pedro testando
router.post('/teste', function(req, res) {
    performance.mark('Begin Login Authentication')
    UnifespController.authenticateProxy(req.body.username, req.body.password).then(response => {
        res.status(200).send(response)
    }, err => {
        res.status(500).send({
            auth: false,
            error: err
        })
    }).finnaly(() => {
        performance.mark('End Login Authentication')
        performance.measure('Login Authentication', 'Begin Login Authentication', 'End Login Authentication')
        console.log('performance')
        console.log(performance.getEntriesByType('measure')[0])
    })
})
//

// TODO: add winston logging to this
router.post('/login', function(req, res){
    performance.mark('Begin Login Authentication')
    var usuario = req.body.login
    var senha = req.body.senha // TODO: encriptar o password no outro lado da chamada usando um metodo 
                                     // conhecido para o servidor, assim mesmo que interceptem a chamada para a api
                                     // nao vao interceptar as credenciais do usuario

    if(usuario == undefined || senha == undefined){
        return res.status(400).send({
            auth: false,
            data: undefined,
            message: 'Missing credentials.'
        })
    }

    // fixar metodo para enviar dados já que ele é chamado em dois lugares
    const sendResult = function(user) {
        var token = auth.token(user) // TODO: invalidar o token assim que o usuário executar logout no app? 
        // ou talvez colocar uma data de expiração e refazer o token a cada X dias?

        // var token = jwt.sign({username: username, password: hashedPassword}, config.secret, {
        //     expiresIn: 86400 // expires in 24 hours
        // });

        console.log(`Login successful for ${user.usuario || user.username} with token: ${token}`)
        res.status(200).send({
            auth: true,
            data: user.data,
            token: token
        })

        performance.mark('End Login Authentication')
        performance.measure('Login Authentication', 'Begin Login Authentication', 'End Login Authentication')
        console.log('performance')
        console.log(performance.getEntriesByType('measure')[0])
    }

    // auth/login vai funcionar como registro se nao houver conta de usuario com essas credenciais (válidas) ou como entrar caso contrario
    console.log(`Authenticating for ${usuario}...`)
    UnifespController.authenticateProxy(usuario, senha).then(result => { // Tentar fazer login no intranet
        console.log('AUTH', result.auth)
        if (result.auth) { // Achou o usuario no intranet e a senha esta correta
            // Users.findByUsernameUnifesp(usuario).then(user => { // Procurar usuario no nosso banco
            //     console.log('USER', user.exists)
            //     if (!user.exists) { // Nao achou, registrar novo usuario e fazer login
            //         console.log(`Registering ${usuario}...`)
            //         Users.registerUnifesp(usuario, senha).then((user) => {
            //             sendResult(user) // Enviar os dados do usuario para fazer login
            //         }).catch(err => {
            //             console.log(err)    
            //         })
            //     } else { // Achou no nosso banco, fazer login
            //         sendResult(user) // Enviar os dados do usuario para fazer login
            //     }
            // })
        }
        else { // Nao deu certo no intranet
            res.status(401).send({
                auth: false,
                message: 'Incorrect credentials'
            })
        }
    }).catch(err => {
        console.log(err)
    })
})

router.get('/me', auth.auth, function (req, res) {
    res.status(200).send(req.user)
    // var token = req.headers['x-access-token'];
    // if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    // jwt.verify(token, config.secret, function(err, decoded) {
    //     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
    //     res.status(200).send(decoded);
    // });
})


module.exports = router