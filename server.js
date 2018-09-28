require('dotenv').config();

var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var router = express.Router()

var server = app.listen(port, () => {
    console.log(`server listening at port ${port}`)
})

var Test = require('./models/Test')
var authController = require('./controllers/AuthController')
var Carona = require('./models/Caronas');
var Alunos = require('./models/Alunos');

// log request middleware
router.use(function(req, res, next) {
    console.log(req.method, req.url)

    next()
})

// Aluno
router.get('/aluno/buscar/:login/:senha', Alunos.getAluno)

// Carona
router.get('/api/caronas/delete/viagem', Carona.deleteViagem)
router.get('/api/caronas/post/viagem', Carona.insertViagem)
router.get('/api/caronas/get/viagem/datahora', Carona.searchViagemDataHora)
router.get('/api/caronas/get/viagem/datahora/local', Carona.searchViagemDataHoraLocal)
router.get('/api/caronas/get/viagem/motorista', Carona.searchViagemMotorista)
router.get('/api/caronas/get/viagem/passageiro', Carona.searchViagemPassageiro) //erro
router.get('/api/caronas/get/localidades', Carona.selectLocalidadeDescricao), //essa n tem apos ?
router.get('/api/caronas/put/viagem/dia', Carona.updateDiaViagem)
router.get('/api/caronas/put/viagem/hora', Carona.updateDiaViagem)
router.get('/api/caronas/get/viagens', Carona.getAllCaronas)


// loucuras abaixo:

app.use('/api/auth', authController)
app.use('/monica', function(req, res){
    const Alunos = require('./models/Alunos')
    Alunos.alteracao_email_aluno('000000', 'novoemail@bol.com')
})
app.use('/', router);

// error handling middleware
// chamar next(err) nos error handling individuais em cada rota pra cair nesse error handler genérico aqui
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json(err);
});