require('dotenv').config()

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
var Grade = require('./models/Grade');
var Utilidades = require('./models/Utilidades');
var Divulgacao = require('./models/Divulgacao');


var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({
    extended: false
}))
router.use(bodyParser.json())

// log request middleware
router.use(function(req, res, next) {
    console.log(req.method, req.url)

    next()
})

router.use('/api/auth', authController)

// Aluno
router.use('/api', require('./controllers/aluno'))

// Carona
router.use('/api', require('./controllers/caronas'))

// Divulgacao
router.get('/api/divulgacao/delete/divulgacao', Divulgacao.remove_divulgacao)
router.get('/api/divulgacao/post/divulgacao', Divulgacao.insert_divulgacao)
router.get('/api/divulgacao/get/divulgacao/diahora', Divulgacao.busca_divulgacao_dia_hora)
router.get('/api/divulgacao/get/divulgacao/dia', Divulgacao.busca_divulgacao_dia)
router.get('/api/divulgacao/get/divulgacao/hora', Divulgacao.busca_divulgacao_hora)
router.get('/api/divulgacao/get/divulgacao/tipodiahora', Divulgacao.busca_divulgacao_tipo_dia_hora) 
router.get('/api/divulgacao/get/tipodia', Divulgacao.busca_divulgacao_tipo_dia)
router.get('/api/divulgacao/get/tipo', Divulgacao.busca_divulgacao_tipo)
router.get('/api/divulgacao/put/dia', Divulgacao.alteracao_divulgacao_dia)
router.get('/api/divulgacao/put/hora', Divulgacao.alteracao_divulgacao_hora)


// Utilidades
router.get('/api/utilidades/get/saldo', Utilidades.getSaldo)
router.get('/api/utilidades/get/matricula', Utilidades.getMatricula)
router.get('/api/utilidades/get/cardapio', Utilidades.getCardapio)
router.get('/api/utilidades/get/historico', Utilidades.getHistorico)

// Grade
router.get('/api/grades/delete/aluno_turma', Grade.delete_aluno_turma)
router.get('/api/grades/delete/evento_turma', Grade.delete_evento_turma)
router.get('/api/grades/delete/horario_turma', Grade.delete_horario_turma)
router.get('/api/grades/delete/horario', Grade.delete_horario)
router.get('/api/grades/delete/pre_req', Grade.delete_pre_req)
router.get('/api/grades/delete/professor', Grade.delete_professor)
router.get('/api/grades/delete/turma', Grade.delete_turma)
router.get('/api/grades/delete/uc', Grade.delete_uc)
router.get('/api/grades/post/aluno_turma', Grade.insert_aluno_turma)
router.get('/api/grades/post/evento_turma', Grade.insert_evento_turma)
router.get('/api/grades/post/horario_turma', Grade.insert_horario_turma)
router.get('/api/grades/post/horario', Grade.insert_horario)
router.get('/api/grades/post/pre_req', Grade.insert_pre_req)
router.get('/api/grades/post/professor', Grade.insert_professor)
router.get('/api/grades/post/turma', Grade.insert_turma)
router.get('/api/grades/post/uc', Grade.insert_uc)
router.get('/api/grades/get/aluno/turma', Grade.select_alunos_turma_tq_idturma)
router.get('/api/grades/get/compromissos/aluno', Grade.select_compromissos_compromisso_tq_raaluno)
router.get('/api/grades/get/eventos', Grade.select_eventos)
router.get('/api/grades/get/evento/aluno', Grade.select_eventos_aluno_tq_raaluno)
router.get('/api/grades/get/evento/turma', Grade.select_eventos_turma_tq_idturma)
router.get('/api/grades/get/grade/aluno', Grade.select_grade_aluno_tq_raaluno)
router.get('/api/grades/get/horario/turma', Grade.select_horarios_turma_tq_idturma)
router.get('/api/grades/get/horarios', Grade.select_horarios)
router.get('/api/grades/get/professor/id', Grade.select_info_professor_tq_idprofessor)
router.get('/api/grades/get/turma/id', Grade.select_info_uc_tq_iduc)
router.get('/api/grades/get/pre_req/uc', Grade.select_prereqs_uc_tq_iduc)
router.get('/api/grades/get/turma/aluno', Grade.select_turmas_aluno_tq_raaluno)
router.get('/api/grades/get/uc/id', Grade.select_turmas_uc_tq_iduc)
router.get('/api/grades/get/ucs', Grade.select_ucs)    
router.get('/api/grades/put/aluno_turma', Grade.update_aluno_turma)
router.get('/api/grades/put/evento_turma', Grade.update_evento_turma)
router.get('/api/grades/put/horario_turma', Grade.update_horario_turma)
router.get('/api/grades/put/horario', Grade.update_horario)
router.get('/api/grades/put/pre_req', Grade.update_pre_req)
router.get('/api/grades/put/professor', Grade.update_professor)
router.get('/api/grades/put/turma', Grade.update_turma)
router.get('/api/grades/put/uc', Grade.update_uc)

// Headers
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

// Router
app.use('/', router)

// error handling middleware
// chamar next(err) nos erro0r handling individuais em cada rota pra cair nesse error handler genérico aqui
app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).json(err)
})