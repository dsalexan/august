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
router.get('/api/caronas/busca/datahora', Carona.searchViagemDataHora)
router.get('/api/caronas/busca/datahora/local', Carona.searchViagemDataHoraLocal)

// router.get('/carona/excluir/:id', Carona.deleteViagem)
// router.get('/carona/inserir/:motorista/:origem/:id_destino, dia, hora, preco, qtd_vagas, descricao', Carona.deleteViagem)
// router.get('/carona/buscar/datahora/local/:data/:hora/:local', Carona.searchViagemDataHoraLocal)

app.use('/api/auth', authController)
app.use('/', router);

// error handling middleware
// chamar next(err) nos error handling individuais em cada rota pra cair nesse error handler genérico aqui
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json(err);
});