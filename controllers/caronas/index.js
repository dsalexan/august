var express = require('express')
var router = express.Router()

const { performance } = require('perf_hooks')
const _ = require('lodash')

const auth = require('../../auth/auth')
var Caronas = require('../../models/Caronas');

// sub-diretorios
// caronas/
//      reservas/
//      passageiros/
//      localidades/

// GET api/caronas/<id_viagem> <- retorna uma viagem especifica
//      GET api/catonas/<id_viagem>/reservas <- retorna as reservas de uma viagem especifica
// GET api/caronas <- retorna todas as viagens OU viagens com parametros especificos
//      GET api/caronas?a=valor;b=value;c=bravura
// POST api/caronas <- insere uma nova viagem
// PUT api/caronas/<id_viagem> <- atualiza as informações de uma viagem
// DELETE api/caronas/<id_viagem> <- remove uma viagem especifica do banco
// GET api/caronas/reservas <- retornar todas as reservas OU reservas com parametros especificos
//      GET api/caronas/reservas?a=valor;b=valor2

router.get('/api/caronas', (req, res, next) => {
    var search = {
        id_motorista: req.query.id_motorista,
        id_passageiro: req.query.id_passageiro
    }
    var fn = Caronas.select_viagens
    if(search.id_motorista) fn = Caronas.select_motorista_id
    if(search.id_passageiro) fn = Caronas.select_passageiro_id

    fn(search)
    .then(v => {
        if(v == null){
            return res.status(404).json({
                message: 'Not Found',
                success: false
            })
        }
        res.status(200).json({
            data: v,
            success: true
        })
    })
    .catch(error => {
        return next(error)
    })
})
router.get('/api/caronas/:id_viagem', (req, res, next) => {
    Caronas.select_viagem_id(req.params.id_viagem)
    .then(v => {
        if(v == null){
            return res.send(404).json({
                message: 'Not Found',
                success: false
            })
        }
        res.status(200).json({
            data: v,
            success: true
        })
    })
    .catch(error => {
        return next(error)
    })
})

router.get('/api/caronas/:id_viagem/reservas', (req, res, next) => {
    var id_viagem = req.params.id_viagem

    Caronas.select_reservas_id(id_viagem)
    .then(v => {
        res.status(200).json({
            data: v,
            success: true
        })
    })
    .catch(error => {
        return next(error);
    });
}) 

// router.get('/api/caronas/viagem/data', Caronas.searchViagemData)


// router.get('/api/caronas/viagem/data_hora_origem_destino_vagas', Caronas.searchViagemDataHoraOrigemDestinoVagas)
// router.get('/api/caronas/viagem/data_hora_origem_destino', Caronas.searchViagemDataHoraOrigemDestino)
// router.get('/api/caronas/viagem/data_hora_origem', Caronas.searchViagemDataHoraOrigem)
// router.get('/api/caronas/viagem/data_hora_destino', Caronas.searchViagemDataHoraDestino)
// router.get('/api/caronas/viagem/data_origem', Caronas.searchViagemDataOrigem)
// router.get('/api/caronas/viagem/data_destino', Caronas.searchViagemDataDestino)
// router.get('/api/caronas/viagem/data_origem_destino', Caronas.searchViagemDataOrigemDestino)
// router.get('/api/caronas/viagem/data_hora_origem_vagas', Caronas.searchViagemDataHoraOrigemVagas)
// router.get('/api/caronas/viagem/data_hora_destino_vagas', Caronas.searchViagemDataHoraDestinoVagas)
// router.get('/api/caronas/viagem/data_hora_vagas', Caronas.searchViagemDataHoraVagas)
// router.get('/api/caronas/viagem/data_vagas', Caronas.searchViagemDataVagas)
// router.get('/api/caronas/viagem/data_hora', Caronas.searchViagemDataHora)
// router.get('/api/caronas/localidades', Caronas.selectLocalidadeDescricao)

router.post('/api/caronas/viagem/reserva', Caronas.solicitarReserva)
router.post('/api/caronas/viagem/origem', Caronas.insertOrigemViagem)
router.post('/api/caronas/viagem/destino', Caronas.insertDestinoViagem)
router.post('/api/caronas/viagem', Caronas.insertViagem)

router.put('/api/caronas/viagem/dia', Caronas.updateDiaViagem)
//router.put('/api/caronas/viagem/hora', Caronas.updateHoraViagem)
router.put('/api/caronas/viagem/reserva', Caronas.updateStatusReserva)

router.delete('/api/caronas/reserva', Caronas.deleteReserva)
router.delete('/api/caronas/viagem_reserva', Caronas.deleteViagemReserva)
router.delete('/api/caronas/viagem_destino', Caronas.deleteViagemDestino)
router.delete('/api/caronas/viagem_origem', Caronas.deleteViagemOrigem)
router.delete('/api/caronas/viagem', Caronas.deleteViagem)
router.delete('/api/caronas/passageiros', Caronas.deletePassageiros)


module.exports = router