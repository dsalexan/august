const db = require('../db')
const sql = require('./sql')
const pq = require('pg-promise').ParameterizedQuery;

module.exports = {
    alteracao_email_aluno: (ra_aluno, email) => {
        const cleber = new pq(sql.alunos.alteracao_email_aluno);
        console.log(cleber)
        db.none(cleber, {email: email, ra_aluno: ra_aluno})
        .then(() =>{
            console.log(`Alteracao de email concluida para o aluno ${ra_aluno}`)
        })
        .catch(error => {
            console.log(error)
        });
    },
    insertViagem: (id_motorista, id_origem, id_destino, dia, hora, preco, qtd_vagas, descricao) => {
        const viagem = new pq(sql.caronas.ins_viagem);
        db.none(viagem, [id_motorista, id_origem, id_destino, dia, hora, preco, qtd_vagas, descricao])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemDataHoraLocal: (d, h, l) => {
        const viagem = new pq(sql.caronas.srch_viagemDataHoraLocal);
        db.any(viagem, [d, h, l])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemDataHora: (d, h) => {
        const viagem = new pq(sql.caronas.srch_viagemDataHora);
        db.any(viagem, [d, h])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemMotorista: (id) => {
        const viagem = new pq(sql.caronas.srch_viagemMotorista);
        db.any(viagem, [id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    searchViagemPassageiro: (id) => {
        const viagem = new pq(sql.caronas.srch_viagemPassageiro);
        db.any(viagem, [id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    selectLocalidadeDescricao: () => {
        const localidades = new pq(sql.caronas.select_localidadesDescricao);
        db.any(localidades)
        .then(l => {
            console.log(l)
        })
        .catch(error => {
            console.log(error)
        });
    },
    selectLocalidade: (descricao) => {
        const viagem = new pq(sql.caronas.select_localidade);
        db.oneOrNone(viagem, [descricao])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    updateDiaViagem: (novo, id) => {
        const viagem = new pq(sql.caronas.update_viagemDia);
        db.none(viagem, [novo, id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
    updateHorarioViagem: (novo, id) => {
        const viagem = new pq(sql.caronas.update_viagemHorario);
        db.none(viagem, [novo, id])
        .then(v => {
            console.log(v)
        })
        .catch(error => {
            console.log(error)
        });
    },
}
