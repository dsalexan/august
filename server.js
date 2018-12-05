require('dotenv').config()

const cors = require('cors')
var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var router = express.Router()
var path = require('path')

global.root_path = path.resolve(__dirname)

// server.setTimeout(90000)

app.use(cors())
app.options('*', cors())

var Test = require('./models/Test')
var authController = require('./controllers/AuthController')

var Carona = require('./models/Caronas')
var Grade = require('./models/Grade')
var Utilidades = require('./models/Utilidades')
var BugReport = require('./models/BugReport')
var Divulgacao = require('./models/Divulgacao')
var Mensagem = require('./models/Mensagens')
var Alunos = require('./models/Alunos')


// // log request middleware
// app.use(function(req, res, next) {
//     console.log(req.method, req.url)

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header("Access-Control-Allow-Headers", "*");
    
//     next();
//     // if ('OPTIONS' == req.method) {
//     //    res.sendStatus(200);
//     // } else {
//     //    next();
//     // }
// })

// app.use(cors())
// app.options('*', cors())

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())


//#region 
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
router.post('/bug/report', BugReport.insertBugReport)

// Carona
router.get('/api/caronas/delete/reserva', Carona.deleteReserva)
router.get('/api/caronas/delete/viagem_reserva', Carona.deleteViagemReserva)
router.get('/api/caronas/delete/viagem_destino', Carona.deleteViagemDestino)
router.get('/api/caronas/delete/viagem_origem', Carona.deleteViagemOrigem)
router.get('/api/caronas/delete/viagem', Carona.deleteViagem)
router.get('/api/caronas/delete/reserva/ida', Carona.del_reservas_idas)
router.get('/api/caronas/delete/reserva/volta', Carona.del_reservas_voltas)
//router.get('/api/caronas/delete/passageiros', Carona.deletePassageiros)

router.post('/api/caronas/:id_viagem/reservas/solicitar', Carona.solicitarReserva)
router.put('/api/caronas/:id_viagem/origem', Carona.insertOrigemViagem)
router.put('/api/caronas/:id_viagem/destino', Carona.insertDestinoViagem)
router.post('/api/caronas', Carona.insertViagem)


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
router.get('/api/caronas/get/viagem/passageiro/reserva', Carona.searchPassageiroReserva)

router.get('/api/caronas/localidades', Carona.selectLocalidadeDescricao)

router.get('/api/caronas/put/viagem/dia', Carona.updateDiaViagem)
// router.get('/api/caronas/put/viagem/hora', Carona.updateHoraViagem)
router.get('/api/caronas/put/viagem/reserva', Carona.updateStatusReserva)
router.get('/api/caronas/put/viagem/diminui_vaga', Carona.updateMenosVaga)
router.get('/api/caronas/put/viagem/aumenta_vaga', Carona.updateMaisVaga)
//router.use('/api', require('./controllers/caronas'))

// Divulgacao
router.get('/api/divulgacao/delete/divulgacao', Divulgacao.remove_divulgacao)
router.get('/api/divulgacao/post/divulgacao', Divulgacao.insert_divulgacao)
router.get('/api/divulgacao/get/divulgacao/dia/hora_inicio', Divulgacao.busca_divulgacao_dia_hora_inicio)
router.get('/api/divulgacao/get/divulgacao/dia/hora_fim', Divulgacao.busca_divulgacao_dia_hora_fim)
router.get('/api/divulgacao/get/divulgacao/dia', Divulgacao.busca_divulgacao_dia)
router.get('/api/divulgacao/get/divulgacao/hora_inicio', Divulgacao.busca_divulgacao_hora_inicio)
router.get('/api/divulgacao/get/divulgacao/hora_fim', Divulgacao.busca_divulgacao_hora_fim)
router.get('/api/divulgacao/get/divulgacao/tipodiahora', Divulgacao.busca_divulgacao_tipo_dia_hora) 
router.get('/api/divulgacao/get/tipodia', Divulgacao.busca_divulgacao_tipo_dia)
router.get('/api/divulgacao/get/divulgacao/tipo', Divulgacao.busca_divulgacao_tipo)
router.get('/api/divulgacao/put/dia', Divulgacao.alteracao_divulgacao_dia)
router.get('/api/divulgacao/put/hora', Divulgacao.alteracao_divulgacao_hora)

// router.get('/api/divulgacao/get/todos/tipo', Divulgacao.busca_divulgacao_todos_tipo)

router.get('/api/divulgacao/put/quantidade', Divulgacao.alteracao_divulgacao_quantidade)
router.get('/api/divulgacao/get/divulgacao', Divulgacao.busca_divulgacao)
router.get('/api/divulgacao/get/divulgacao/vendedor/ra_aluno', Divulgacao.busca_divulgacao_vendedor_ra_aluno)
router.get('/api/divulgacao/get/divulgacao/comprador/ra_aluno', Divulgacao.busca_divulgacao_comprador_ra_aluno)
router.get('/api/divulgacao/get/divulgacao/tipo/quantidade', Divulgacao.busca_divulgacao_tipo_quantidade)
router.get('/api/divulgacao/get/divulgacao/tipo/preco', Divulgacao.busca_divulgacao_tipo_preco)
router.get('/api/divulgacao/get/divulgacao/quantidade', Divulgacao.busca_divulgacao_quantidade)
router.get('/api/divulgacao/get/divulgacao/preco', Divulgacao.busca_divulgacao_preco)
router.get('/api/divulgacao/get/divulgacao/dia/quantidade', Divulgacao.busca_divulgacao_dia_quantidade)
router.get('/api/divulgacao/get/divulgacao/dia/preco', Divulgacao.busca_divulgacao_dia_preco)
router.get('/api/divulgacao/get/divulgacao/select_tipo', Divulgacao.select_tipo)
router.get('/api/reserva_divulgacao/post/reserva_divulgacao', Divulgacao.insert_reserva_divulgacao)
router.get('/api/reserva_divulgacao/get/reservas' , Divulgacao.busca_divulgacao_reservas)
router.get('/api/reserva_divulgacao/delete/reservas', Divulgacao.remove_divulgacao_reservas)
router.get('/api/reserva_divulgacao/delete/todas_reservas', Divulgacao.remove_divulgacao_todas_reservas)
router.get('/api/divulgacao/put/setar_quantidade', Divulgacao.setar_quantidade)





// Utilidades
router.get('/api/utilidades/saldo/:ra_aluno', Utilidades.getSaldo)
router.get('/api/utilidades/matricula', Utilidades.getMatricula)
router.get('/api/utilidades/cardapio', Utilidades.getCardapio)
router.get('/api/utilidades/historico', Utilidades.getHistorico)

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

router.get('/api/grades/post/horario_turma', Grade.insert_horario_turma)
router.get('/api/grades/post/horario', Grade.insert_horario)
router.get('/api/grades/post/pre_req', Grade.insert_pre_req)
router.get('/api/grades/post/professor', Grade.insert_professor)
router.get('/api/grades/post/turma', Grade.insert_turma)
router.get('/api/grades/post/uc', Grade.insert_uc)

router.get('/api/grade/:ra_aluno/compromissos', Grade.select_compromissos_compromisso_tq_raaluno)

router.get('/api/grade/eventos', Grade.select_eventos)

router.get('/api/grades/get/evento/aluno', Grade.select_eventos_aluno_tq_raaluno)
router.get('/api/grades/get/grade/aluno', Grade.select_grade_aluno_tq_raaluno)
router.get('/api/grades/get/horario/turma', Grade.select_horarios_turma_tq_idturma)
router.get('/api/grades/get/horarios', Grade.select_horarios)
router.get('/api/grades/get/professor/id', Grade.select_info_professor_tq_idprofessor)

router.get('/api/grade/turmas/:id_turma', Grade.select_info_turma_tq_idturma)
router.get('/api/grade/turmas/:id_turma/alunos', Grade.select_alunos_turma_tq_idturma)
router.get('/api/grade/turmas/:id_turma/eventos', Grade.select_eventos_turma_tq_idturma)

router.get('/api/grade/:ra_aluno/turmas', Grade.select_turmas_aluno_tq_raaluno)
router.get('/api/grade/:ra_aluno/turmas/:id_turma/faltas', (req, res) => {
    var ra_aluno = req.params.ra_aluno
    var id_turma = req.params.id_turma

    Grade.select_faltas_aluno_turma(ra_aluno, id_turma)
    .then((faltas) => {
        res.status(200).json({
            success: true,
            data: faltas
        })
    })
    .catch(error => {
        return next(error)
    })
})
router.post('/api/grade/:ra_aluno/turmas/:id_turma/eventos', Grade.insert_evento_turma)

router.put('/api/grade/:ra_aluno/turmas/:id_turma/faltas', async (req, res, next) => {
    let ra_aluno = req.params.ra_aluno
    let id_turma = req.params.id_turma

    let value = req.body.value

    if(value == undefined){
        value = await Grade.select_faltas_aluno_turma(ra_aluno, id_turma).faltas
    }

    if(req.body.add){
        value += parseInt(req.body.add)
    }
    if(req.body.subtract){
        value -= parseInt(req.body.subtract)
    }

    Grade.update_faltas_aluno_turma(ra_aluno, id_turma, value).then(() => {
        res.status(200).json({
            success: true
        })
    }).catch(error => {
        return next(error)
    })
})

router.get('/api/grades/get/uc/id', Grade.select_info_uc_tq_iduc)
router.get('/api/grades/get/pre_req/uc', Grade.select_prereqs_uc_tq_iduc)

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


// Mensagens
router.get('/api/mensagem/post/mensagem', Mensagem.insert_msg)

router.get('/api/mensagens/lidas', Mensagem.get_read_msgs)
router.get('/api/mensagens/novas', Mensagem.get_nonread_msgs)

router.delete('/api/mensagens/:id_mensagem', Mensagem.delete_msg)

router.put('/api/mensagens/:id_mensagem', Mensagem.alterar_status_msg)

//#endregion

// Headers
app.use(function(req, res, next) {
    console.log(req.method, req.url)
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,Origin,Accept,Access-Control-Allow-Headers,Access-Control-Allow-Methods,Access-Control-Allow-Origin') //'Origin, X-Requested-With, Content-Type, Accept')
    
    next()
//     if (req.method === 'OPTIONS') {
//         console.log('!OPTIONS');
//         var headers = {};
//         // IE8 does not allow domains to be specified, just the *
//         // headers["Access-Control-Allow-Origin"] = req.headers.origin;
//         headers["Access-Control-Allow-Origin"] = "*";
//         headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
//         headers["Access-Control-Allow-Credentials"] = false;
//         headers["Access-Control-Max-Age"] = '86400'; // 24 hours
//         headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
//         res.writeHead(200, headers);
//         res.end();
//   } else {
//   //...other requests
//     console.log(req.method, req.url)
//     next()
//   }
// //     res.header('Access-Control-Allow-Origin', '*')
// //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
})


// Router
app.use('/', router)

// app.options('/teste', (req, res, next) => {
//     res.status(200)
//     next()
// })
app.post('/teste', (req, res, next) => {
    console.log('TESTE ACHOU', req.body)
    res.status(200).send(req.body)
})
app.put('/teste', (req, res, next) => {
    console.log('TESTE ACHOU', req.body)
    res.status(200).send(req.body)
})
app.get('/teste', (req, res, next) => {
    console.log('TESTE GET ACHOU')
    res.status(200).send('ACHO')
})

// error handling middleware
// chamar next(err) nos erro0r handling individuais em cada rota pra cair nesse error handler genérico aqui
app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).json(err)
})


var server = app.listen(port, () => {
    console.log(`server listening at port ${port}`)
})