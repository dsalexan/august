const db = require('../db')
const sql = require('../queries')
const pq = require('pg-promise').ParameterizedQuery

module.exports = {
    teste: (req, res, next) => {
        var raTeste = '111111'
        dados = {ra_aluno: raTeste}

        const teste = new pq(sql.grade.select_grade_aluno_tq_raaluno)
        console.log(teste)
        
        db.any(teste.text, dados)
        .then(v => {
            console.log(v)
            // res.status(200).json({
            //     data: v,
            //     success: true
            // })
        })
        // .catch(error => {
        //     return next(error);
        // });
    },
    delete_aluno_turma: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = {ra_aluno: ra_aluno}

        const query = new pq(sql.grade.delete_aluno_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    delete_evento_turma: (req, res, next) => {
        var id_evento = req.query.id_evento

        dados = {id_evento: id_evento}

        const query = new pq(sql.grade.delete_evento_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    delete_horario_turma: (req, res, next) => {
        var id_horario = req.query.id_horario
        var id_turma = req.query.id_turma

        dados = {id_horario: id_horario, id_turma: id_turma}

        const query = new pq(sql.grade.delete_horario_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    delete_horario: (req, res, next) => {
        var id_horario = req.query.id_horario

        dados = {id_horario}

        const query = new pq(sql.grade.delete_horario)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    delete_pre_req: (req, res, next) => {
        var id_uc = req.query.id_uc
        var id_pre_req = req.query.id_pre_req

        dados = {id_uc: id_uc, id_pre_req: id_pre_req}

        const query = new pq(sql.grade.delete_pre_req)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    delete_professor: (req, res, next) => {
        var id_professor = req.query.id_professor

        dados = {id_professor: id_professor}

        const query = new pq(sql.grade.delete_professor)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    delete_turma: (req, res, next) => {
        var id_turma = req.query.id_turma

        dados = {id_turma: id_turma}

        const query = new pq(sql.grade.delete_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    delete_uc: (req, res, next) => {
        var id_uc = req.query.id_uc

        dados = {id_uc: id_uc}

        const query = new pq(sql.grade.delete_uc)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_aluno_turma: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var id_turma = req.query.id_turma
        var faltas = req.query.faltas

        dados = {ra_aluno: ra_aluno, id_turma: id_turma, faltas: faltas}

        const query = new pq(sql.grade.insert_aluno_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_evento_turma: (req, res, next) => {
        var id_evento = req.query.id_evento
        var id_turma = req.query.id_turma
        var ra_aluno = req.query.ra_aluno
        var data = req.query.data
        var hora = req.query.hora
        var sala = req.query.sala
        var descricao = req.query.descricao

        dados = {id_evento: id_evento, id_turma: id_turma, ra_aluno: ra_aluno, data: data, hora: hora, sala: sala, descricao: descricao}

        console.log(dados)

        const query = new pq(sql.grade.insert_evento_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_horario_turma: (req, res, next) => {
        var id_turma = req.query.id_turma
        var id_horario = req.query.id_horario
        var sala = req.query.sala

        dados = {id_turma: id_turma, id_horario: id_horario, sala: sala}

        const query = new pq(sql.grade.insert_horario_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_horario: (req, res, next) => {
        var dia_semana = req.query.dia_semana
        var hora = req.query.hora

        dados = {dia_semana: dia_semana, hora: hora}

        const query = new pq(sql.grade.insert_horario)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_pre_req: (req, res, next) => {
        var id_uc = req.query.id_uc
        var id_pre_req = req.query.id_pre_req

        dados = {id_uc: id_uc, id_pre_req: id_pre_req}

        const query = new pq(sql.grade.insert_pre_req)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_professor: (req, res, next) => {
        var nome = req.query.nome
        var sala = req.query.sala
        var lattes = req.query.lattes
        var email1 = req.query.email1
        var email2 = req.query.email2

        dados = {nome: nome, sala: sala, lattes: lattes, email1: email1, email2: email2}

        const query = new pq(sql.grade.insert_professor)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_turma: (req, res, next) => {
        var id_uc = req.query.id_uc
        var id_professor = req.query.id_professor
        var nome = req.query.nome

        dados = {id_uc: id_uc, id_professor: id_professor, nome: nome}

        const query = new pq(sql.grade.insert_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    insert_uc: (req, res, next) => {
        var nome = req.query.nome
        var creditos = req.query.creditos

        dados = {nome: nome, creditos: creditos}

        const query = new pq(sql.grade.insert_uc)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_alunos_turma_tq_idturma: (req, res, next) => {
        var id_turma = req.query.id_turma

        dados = {id_turma: id_turma}

        const query = new pq(sql.grade.select_alunos_turma_tq_idturma)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_compromissos_compromisso_tq_raaluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var dt_inicio = req.query.dt_inicio
        var dt_fim = req.query.dt_fim

        dados = {ra_aluno: ra_aluno, dt_inicio: dt_inicio, dt_fim: dt_fim}

        const query = new pq(sql.grade.select_compromissos_compromisso_tq_raaluno)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error);
        });
    },
    select_eventos: (req, res, next) => {
        const query = new pq(sql.grade.select_eventos)
        db.any(query.text)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error);
        });
    },
    select_eventos_aluno_tq_raaluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = {ra_aluno: ra_aluno}

        const query = new pq(sql.grade.select_eventos_aluno_tq_raaluno)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_eventos_turma_tq_idturma: (req, res, next) => {
        var id_turma = req.query.id_turma

        dados = {id_turma: id_turma}

        const query = new pq(sql.grade.select_eventos_turma_tq_idturma)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_grade_aluno_tq_raaluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = {ra_aluno: ra_aluno}

        const query = new pq(sql.grade.select_grade_aluno_tq_raaluno)
        db.any(query.text, dados)
        .then(q => {
            console.log(q)
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_horarios_turma_tq_idturma: (req, res, next) => {
        var id_turma = req.query.id_turma

        dados = {id_turma: id_turma}

        const query = new pq(sql.grade.select_horarios_turma_tq_idturma)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_horarios: (req, res, next) => {
        dados = {}

        const query = new pq(sql.grade.select_horarios)
        db.any(query.text)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_info_professor_tq_idprofessor: (req, res, next) => {
        var id_professor = req.query.id_professor

        dados = {id_professor: id_professor}

        const query = new pq(sql.grade.select_info_professor_tq_idprofessor)
        db.one(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_info_turma_tq_idturma: (req, res, next) => {
        var id_turma = req.query.id_turma

        dados = {id_turma: id_turma}

        const query = new pq(sql.grade.select_info_turma_tq_idturma)
        db.one(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_info_uc_tq_iduc: (req, res, next) => {
        var id_uc = req.query.id_uc

        dados = {id_uc: id_uc}

        const query = new pq(sql.grade.select_info_uc_tq_iduc)
        db.one(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_prereqs_uc_tq_iduc: (req, res, next) => {
        var id_uc = req.query.id_uc

        dados = {id_uc: id_uc}

        const query = new pq(sql.grade.select_prereqs_uc_tq_iduc)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_turmas_aluno_tq_raaluno: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno

        dados = {ra_aluno: ra_aluno}

        const query = new pq(sql.grade.select_turmas_aluno_tq_raaluno)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_turmas_uc_tq_iduc: (req, res, next) => {
        var id_uc = req.query.id_uc

        dados = {id_uc: id_uc}

        const query = new pq(sql.grade.select_turmas_uc_tq_iduc)
        db.any(query.text, dados)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    select_ucs: (req, res, next) => {
        dados = {}

        const query = new pq(sql.grade.select_ucs)
        db.any(query.text)
        .then(q => {
            res.status(200).json({
                data: q,
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_aluno_turma: (req, res, next) => {
        var ra_aluno = req.query.ra_aluno
        var id_turma = req.query.id_turma
        var faltas = req.query.faltas

        dados = {ra_aluno: ra_aluno, id_turma: id_turma, faltas: faltas}

        const query = new pq(sql.grade.update_aluno_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_evento_turma: (req, res, next) => {
        var id_evento = req.query.id_evento
        var id_turma = req.query.id_turma
        var ra_aluno = req.query.ra_aluno
        var data = req.query.data
        var sala = req.query.sala
        var descricao = req.query.descricao

        dados = {id_evento: id_evento, id_turma: id_turma, ra_aluno: ra_aluno, data: data, sala: sala, descricao: descricao}

        const query = new pq(sql.grade.update_evento_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_horario_turma: (req, res, next) => {
        var id_turma = req.query.id_turma
        var id_horario = req.query.id_horario
        var sala = req.query.sala

        dados = {id_turma: id_turma, id_horario: id_horario, sala: sala}

        const query = new pq(sql.grade.update_horario_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_horario: (req, res, next) => {
        var dia_semana = req.query.dia_semana
        var hora = req.query.hora
        var id_horario = req.query.id_horario

        dados = {dia_semana: dia_semana, hora: hora, id_horario: id_horario}

        const query = new pq(sql.grade.update_horario)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_pre_req: (req, res, next) => {
        var id_uc = req.query.id_uc
        var id_pre_req = req.query.id_pre_req

        dados = {id_uc: id_uc, id_pre_req: id_pre_req}

        const query = new pq(sql.grade.update_pre_req)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_professor: (req, res, next) => {
        var nome = req.query.nome
        var sala = req.query.sala
        var lattes = req.query.lattes
        var email1 = req.query.email1
        var email2 = req.query.email2
        var id_professor = req.query.id_professor

        dados = {nome: nome, sala: sala, lattes: lattes, email1: email1, email2: email2, id_professor: id_professor}

        const query = new pq(sql.grade.update_professor)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_turma: (req, res, next) => {
        var id_uc = req.query.id_uc
        var id_professor = req.query.id_professor
        var nome = req.query.nome
        var id_turma = req.query.id_turma

        dados = {id_uc: id_uc, id_professor: id_professor, nome: nome, id_turma: id_turma}

        const query = new pq(sql.grade.update_turma)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    },
    update_uc: (req, res, next) => {
        var nome = req.query.nome
        var creditos = req.query.creditos
        var id_uc = req.query.id_uc

        dados = {nome: nome, creditos: creditos, id_uc: id_uc}

        const query = new pq(sql.grade.update_uc)
        db.none(query.text, dados)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(error => {
            return next(error)
        })
    }
}