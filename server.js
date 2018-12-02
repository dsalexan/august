require('dotenv').config()

var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var router = express.Router()
var path = require('path')

global.root_path = path.resolve(__dirname)

var server = app.listen(port, () => {
    console.log(`server listening at port ${port}`)
})
server.setTimeout(90000)

var Test = require('./models/Test')
var authController = require('./controllers/AuthController')

var Carona = require('./models/Caronas')
var Grade = require('./models/Grade')
var Utilidades = require('./models/Utilidades')
var BugReport = require('./models/BugReport')
var Divulgacao = require('./models/Divulgacao')
var Mensagem = require('./models/Mensagens')
var Aluno = require('./models/Alunos');

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

// Unifesp
router.use('/api/unifesp', require('./controllers/unifesp'))

// Aluno
router.use('/api', require('./controllers/aluno'))
router.get('/api/aluno/update/email', Alunos.update_email_aluno)
router.get('/api/aluno/update/telefone', Alunos.update_nome_aluno)

// Cardapio
router.use('/api/ru/', require('./controllers/cardapio'))
// router.use('/api/ru/get/atual', Utilidades.getCardapio)

// Bug Reports
router.use('/api/bugreport/put/bug', BugReport.insertBugReport)

// Carona
router.get('/api/caronas/delete/reserva', Carona.deleteReserva)
router.get('/api/caronas/delete/viagem_reserva', Carona.deleteViagemReserva)
router.get('/api/caronas/delete/viagem_destino', Carona.deleteViagemDestino)
router.get('/api/caronas/delete/viagem_origem', Carona.deleteViagemOrigem)
router.get('/api/caronas/delete/viagem', Carona.deleteViagem)
router.get('/api/caronas/delete/reserva/ida', Carona.del_reservas_idas)
router.get('/api/caronas/delete/reserva/volta', Carona.del_reservas_voltas)
//router.get('/api/caronas/delete/passageiros', Carona.deletePassageiros)
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
router.get('/api/caronas/get/viagem/reserva', Carona.searchViagemReserva) 
router.get('/api/caronas/get/viagem/motorista/reserva', Carona.srch_MotoristaReserva)
router.get('/api/caronas/get/localidades', Carona.selectLocalidadeDescricao)
router.get('/api/caronas/put/viagem/dia', Carona.updateDiaViagem)
// router.get('/api/caronas/put/viagem/hora', Carona.updateHoraViagem)
router.get('/api/caronas/put/viagem/reserva', Carona.updateStatusReserva)
router.get('/api/caronas/put/viagem/diminui_vaga', Carona.updateMenosVaga)
router.get('/api/caronas/put/viagem/aumenta_vaga', Carona.updateMaisVaga)
//router.use('/api', require('./controllers/caronas'))

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
router.get('/api/divulgacao/get/todos/tipo', Divulgacao.busca_divulgacao_todos_tipo)


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
router.get('/api/grades/post/aluno_turma', (req, res, next) => {
    var ra_aluno = req.query.ra_aluno
    var id_turma = req.query.id_turma
    var faltas = req.query.faltas

    Grade.insert_aluno_turma(ra_aluno, id_turma, faltas)
    .then(() => {
        res.status(200).json({
            success: true
        })
    })
    .catch(error => {
        return next(error)
    })
})
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
router.get('/api/grades/get/turma/id', Grade.select_info_turma_tq_idturma)
router.get('/api/grades/get/uc/id', Grade.select_info_uc_tq_iduc)
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

router.get('/api/grades/put/addfalta', Grade.update_aluno_turma_addfalta)
router.get('/api/grades/put/removefalta', Grade.update_aluno_turma_removefalta)
router.get('/api/grades/get/faltas', Grade.select_faltas_aluno_turma)
// Mensagens
router.get('/api/mensagem/post/mensagem', Mensagem.insert_msg)
router.get('/api/mensagem/get/lidas', Mensagem.get_read_msgs)
router.get('/api/mensagem/get/novas', Mensagem.get_nonread_msgs)
router.get('/api/mensagem/delete/mensagem', Mensagem.delete_msg)
router.get('/api/mensagem/put/mensagem', Mensagem.alterar_status_msg)

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