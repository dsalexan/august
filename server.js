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
var Carona = require('./models/Caronas')
var Alunos = require('./models/Alunos')
var Grade = require('./models/Grade')
var Utilidades = require('./models/Utilidades')

// log request middleware
router.use(function(req, res, next) {
    console.log(req.method, req.url)

    next()
})

router.use('/api/auth', authController)

// Aluno
router.get('/api/alunos/get/senha', Alunos.getAluno)
router.get('/api/alunos/put/email', Alunos.alteracao_email_aluno)
router.get('/api/alunos/put/nome', Alunos.alteracao_nome_aluno)
router.get('/api/alunos/get/aluno', Alunos.consulta_aluno)
router.get('/api/alunos/post/aluno', Alunos.insert_aluno)
router.get('/api/alunos/delete/aluno', Alunos.remove_aluno)

// Carona
router.get('/api/caronas/delete/reserva', Carona.deleteReserva)
router.get('/api/caronas/delete/viagem', Carona.deleteViagem)
router.get('/api/caronas/post/viagem/reserva', Carona.solicitarReserva)
router.get('/api/caronas/post/viagem/origem', Carona.insertOrigemViagem)
router.get('/api/caronas/post/viagem/destino', Carona.insertDestinoViagem)
router.get('/api/caronas/post/viagem', Carona.insertViagem)
router.get('/api/caronas/get/viagem/data_hora_origem_destino_vagas', Carona.searchViagemDataHoraOrigemDestinoVagas)
router.get('/api/caronas/get/viagem/data_hora_origem_destino', Carona.searchViagemDataHoraOrigemDestino)
router.get('/api/caronas/get/viagem/data_hora_origem', Carona.searchViagemDataHoraOrigem)
router.get('/api/caronas/get/viagem/data_hora_destino', Carona.searchViagemDataHoraDestino)
router.get('/api/caronas/get/viagem/data_origem', Carona.searchViagemDataOrigem)
router.get('/api/caronas/get/viagem/data_destino', Carona.searchViagemDataDestino)
router.get('/api/caronas/get/viagem/data_origem_destino', Carona.searchViagemDataOrigemDestino)
router.get('/api/caronas/get/viagem/data_hora_origem_vagas', Carona.searchViagemDataHoraOrigemVagas)
router.get('/api/caronas/get/viagem/data_hora_destino_vagas', Carona.searchViagemDataHoraDestinoVagas)
router.get('/api/caronas/get/viagem/data_hora_vagas', Carona.searchViagemDataHoraVagas)
router.get('/api/caronas/get/viagem/data_vagas', Carona.searchViagemDataVagas)
router.get('/api/caronas/get/viagem/data_hora', Carona.searchViagemDataHora)
router.get('/api/caronas/get/viagem/data', Carona.searchViagemData)
router.get('/api/caronas/get/viagem/motorista', Carona.searchViagemMotorista)
router.get('/api/caronas/get/viagem/passageiro', Carona.searchViagemPassageiro) 
router.get('/api/caronas/get/viagem', Carona.getAllCaronas)
router.get('/api/caronas/get/reserva', Carona.searchReserva) 
router.get('/api/caronas/get/localidades', Carona.selectLocalidadeDescricao)
router.get('/api/caronas/put/viagem/dia', Carona.updateDiaViagem)
//router.get('/api/caronas/put/viagem/hora', Carona.updateHoraViagem)
router.get('/api/caronas/put/viagem/reserva', Carona.updateStatusReserva)

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
router.get('/api/grade/get/compromissos/aluno', Grade.select_compromissos_compromisso_tq_raaluno)
router.get('/api/grades/get/evento/aluno', Grade.select_eventos_aluno_tq_raaluno)
router.get('/api/grades/get/evento/turma', Grade.select_eventos_turma_tq_idturma)
router.get('/api/grades/get/grade/aluno', Grade.select_grade_aluno_tq_raaluno)
router.get('/api/grades/get/horario/turma', Grade.select_horarios_turma_tq_idturma)
router.get('/api/grades/get/horarios', Grade.select_horarios)
router.get('/api/grades/get/professor/id', Grade.select_info_professor_tq_idprofessor)
router.get('/api/grades/get/turma/id', Grade.select_info_uc_tq_iduc)
router.get('/api/grades/get/pre_req/uc', Grade.select_prereqs_uc_tq_iduc)
router.get('/api/grades/get/aluno/ra', Grade.select_turmas_aluno_tq_raaluno)
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