const path = require('path')
var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({
    extended: false
}))
router.use(bodyParser.json())

const auth = require('../auth/auth')

const unifesp = require('../libraries/unifesp')
const historico = require('../libraries/unifesp/historico')
const atestado = require('../libraries/unifesp/atestado')
const agenda = require('../libraries/unifesp/agenda')

var Users = require('../models/Users')
var Alunos = require('../models/Alunos')

const { performance } = require('perf_hooks')

// Pedro testando
router.post('/teste/historico', function(req, res) {    
    unifesp.fetch('historico', {
        username: req.body.username,
        password: req.body.password
    }).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.send(500).send({
            error: err
        })
    })
})
router.post('/teste/atestado', function(req, res) { 
    unifesp.fetch('atestado', {
        username: req.body.username,
        password: req.body.password
    }).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.send(500).send({
            error: err
        })
    })
})
router.post('/teste/agenda', function(req, res) {
    unifesp.fetch('agenda', req.body.date).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.send(500).send({
            error: err
        })
    })
})
router.get('/teste/ementas', function(req, res) {
    process.setMaxListeners(100)
    unifesp.fetch('ementas', {
        path: path.join(global.root_path, 'res/ementas'),
        download: false
    }).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.send(500).send({
            error: err
        })
    })
})
//

// TODO: add winston logging to this
router.post('/login', function(req, res){
    perfHash = Math.random().toString(36).substring(2, 9)
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

    // auth/login vai funcionar como registro se nao houver conta de usuario com essas credenciais (válidas) ou como entrar caso contrario
    console.log(`Authenticating for ${usuario}...`)
    var loginAttempt = {
        page: undefined
    }
    unifesp.authenticate(usuario, senha, {
        keep_puppet: true
    }).then(result => { // Tentar fazer login no intranet
        if (result.auth) { // Achou o usuario no intranet e a senha esta correta
            Alunos.check_register_aluno(usuario).then(user => { // Procurar usuario no nosso banco
                if (!user.exists) { // Nao achou, registrar novo usuario e fazer login
                    console.log(`Registering ${usuario}...`)

                    unifesp.fetch('historico', undefined, {
                        puppeteer: result.puppeteer,
                        authenticated: true
                    }).then(historico => {
                        Alunos.register_aluno(historico.ra_aluno, historico.nome, usuario, senha).then((user) => {
                            sendResult(user.data) // Enviar os dados do usuario para fazer login
                        }).catch(err => {
                            console.log(err)    
                        })
                    })
                } else { // Achou no nosso banco, fazer login
                    result.puppeteer.browser.close()
                    sendResult(user.data) // Enviar os dados do usuario para fazer login
                }
            })
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

    // fixar metodo para enviar dados já que ele é chamado em dois lugares
    var sendResult = function(user) {
        var token = auth.token(user) // TODO: invalidar o token assim que o usuário executar logout no app? 
        // ou talvez colocar uma data de expiração e refazer o token a cada X dias?

        // var token = jwt.sign({username: username, password: hashedPassword}, config.secret, {
        //     expiresIn: 86400 // expires in 24 hours
        // });

        console.log(`Login successful for <${user.login_intranet}> with token: ${token}`)
        res.status(200).send({
            auth: true,
            data: {
                nome: user.nome,
                login: user.login_intranet
            },
            token: token
        })

        performance.mark('End Login Authentication')
        performance.measure('Login Authentication', 'Begin Login Authentication', 'End Login Authentication')
        console.log('performance', perfHash, performance.getEntriesByType('measure').pop().duration)
    }
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