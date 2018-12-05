const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery
const unifesp = require('../libraries/unifesp')
const cryptoJS = require("crypto-js");
const Alunos = require('../models/Alunos')
const DateTime = require('../utils/luxon')

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

module.exports = {
    select_latest_saldo_aluno: (ra_aluno) => db.oneOrNone(sql.utilidades.select_latest_saldo_aluno, [ra_aluno]),


    getSaldo: async (req, res) => {
        var ra_aluno = req.params.ra_aluno

        let aluno = await Alunos.select_aluno_ra(ra_aluno)

        unifesp.fetch('saldo_ru', aluno).then(result => {
            res.status(200).send(result.extracao && result.extracao.saldo)
        })
    },
    getMatricula: (req, res, next) => {
        var id_motorista = req.query.id_motorista
        var id_origem = req.query.id_origem
        var id_destino = req.query.id_destino
        var dia = req.query.dia
        var hora = req.query.hora
        var preco = req.query.preco
        var qtd_vagas = req.query.qtd_vagas
        var descricao = req.query.descricao
        
        dados = [id_motorista, id_origem, id_destino, dia, hora, preco, qtd_vagas, descricao]

        const viagem = new pq(sql.caronas.ins_viagem)
        db.none(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    getHistorico: (req, res, next) => {
        var data = req.query.data
        var hora = req.query.hora
        var local = req.query.local

        dados = [data, hora, local]
        
        const viagem = new pq(sql.caronas.srch_viagemDataHoraLocal)
        db.any(viagem, dados)
        .then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insertCardapio: (info) => {
        var cardapio = info.json_cardapio
        var data_solicitacao = info.data.data_solicitacao
        
        dados = [cardapio, data_solicitacao]

        const cardapio_query = new pq(sql.utilidades.insert_cardapio)
        return db.none(cardapio_query, dados)
    },
    getCardapio: (req, res, next) => {

        const cardapio_query = new pq(sql.utilidades.get_last_cardapio)
        db.any(cardapio_query).then(v => {
            res.status(200).json({
                data: v,
                success: true
            })
        }).catch(error => {
            return next(error)
        })
    }
}