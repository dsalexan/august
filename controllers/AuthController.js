const path = require('path')
var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({
    extended: false
}))
router.use(bodyParser.json())

const auth = require('../auth/auth')
const cryptoJS = require("crypto-js");

const unifesp = require('../libraries/unifesp')
const historico = require('../libraries/unifesp/historico')
const atestado = require('../libraries/unifesp/atestado')
const saldo_ru = require('../libraries/unifesp/saldo_ru')
const index = require('../libraries/unifesp/index')
const agenda = require('../libraries/unifesp/agenda')

var Users = require('../models/Users')
var Alunos = require('../models/Alunos')

const { performance } = require('perf_hooks')

var ModelProfessores = require('../models/Professores')

// Pedro testando
var Professores = require('../libraries/unifesp/professores')
router.get('/atualizarcorpodocente', function(req, res) {
    index.getCorpoDocente().then(corpoDocente => {
        // console.log(corpoDocente)
        corpoDocente.professores.forEach(professor => {
            console.log(professor.nome)
            ModelProfessores.insert_professor(professor)
        });
    })
})

router.get('/teste', function(req, res) {
    unifesp.fetch('saldo_ru', undefined, {
        puppeteer: result.puppeteer,
        authenticated: true
    }).then(saldo => {
        console.log(saldo)
        res.status(200).send(saldo)
    })
})

router.get('/teste/ementas', function(req, res) {
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

// router.get('/logintemp', function(req, res) {
//     var usuario = req.query.login
//     var senha = decrypt(req.query.senha, 'Achilles').toString(cryptoJS.enc.Utf8)
//     unifesp.getSaldoRu(usuario, senha).then(result => {
//         console.log(result)
//     })
// })

// TODO: add winston logging to this
router.post('/login', function(req, res){
    perfHash = Math.random().toString(36).substring(2, 9)
    performance.mark('Begin Login Authentication')

    var usuario = req.body.login
    var encrypted_senha = req.body.senha
    var senha = decrypt(encrypted_senha, 'Achilles').toString(cryptoJS.enc.Utf8)

                        // TODO: encriptar o password no outro lado da chamada usando um metodo 
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
                console.log('Exists', user.exists)
                if (!user.exists) { // Nao achou, registrar novo usuario e fazer login
                    console.log(`Registering ${usuario}...`)
                    unifesp.fetch('historico', undefined, {
                        puppeteer: result.puppeteer,
                        authenticated: true
                    }).then(historico => {
                        Alunos.register_aluno(historico.extracao.ra_aluno, historico.extracao.nome, usuario, encrypted_senha).then((user) => {
                            sendResult(user.data) // Enviar os dados do usuario para fazer login
                        })
                    }).catch(err => {
                        console.log('Error: ', err)
                    })
                    // }).then(saldo => {
                    //     console.log(saldo)
                } else { // Achou no nosso banco, fazer login
                    // result.puppeteer.browser.close()
                    // console.log(user.data)
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
        console.log("oi tamo aqui")
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
                ra: user.ra_aluno,
                nome: user.nome,
                login: user.login_intranet,
                email: user.email,
                telefone: user.telefone
            },
            token: token
        })

        // performance.mark('End Login Authentication')
        // performance.measure('Login Authentication', 'Begin Login Authentication', 'End Login Authentication')
        // console.log('performance', perfHash, performance.getEntriesByType('measure').pop().duration)
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

function decrypt(transitmessage, pass) {
    var keySize = 256;
    var iterations = 100;

    var salt = cryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = cryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    var encrypted = transitmessage.substring(64);
    
    var key = cryptoJS.PBKDF2(pass, salt, {
        keySize: keySize/32,
        iterations: iterations
    });
  
    var decrypted = cryptoJS.AES.decrypt(encrypted, key, { 
        iv: iv, 
        padding: cryptoJS.pad.Pkcs7,
        mode: cryptoJS.mode.CBC
    })
    return decrypted;
}

module.exports = router