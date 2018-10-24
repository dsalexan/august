// File sql.js

// Proper way to organize an sql provider:
//
// - have all sql files for Users in ./sql/users
// - have all sql files for Products in ./sql/products
// - have your sql provider module as ./sql/index.js

const QueryFile = require('pg-promise').QueryFile
const path = require('path')
const fs = require('fs')

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file) // generating full path;

    let stats = fs.statSync(fullPath)
    if(stats.isFile())
        return (new QueryFile(fullPath, {minify: true}))
    else{
        let map = {}
        fs.readdirSync(fullPath).forEach(file => {
            map[file.replace('.sql', '')] = new QueryFile(path.join(fullPath, file))
        })
        return map
    }            
}

module.exports = {
    test: {
        get: sql('test/get.sql')
    },
    users: {
        insert: sql('users/insert.sql')
    },
    caronas: {
        del_reserva: sql('carona/delete_reserva.sql'),
        del_viagem: sql('carona/delete_viagem.sql'),
        del_viagemReserva: sql('carona/delete_viagemReserva.sql'),
        del_viagemDestino: sql('carona/delete_viagemDestino.sql'),
        del_viagemOrigem: sql('carona/delete_viagemOrigem.sql'),
        del_passageiros: sql('carona/search_reservas_before_delete.sql'),
        get_all: sql('carona/get_all.sql'),
        solic_reserva: sql('carona/insert_reserva.sql'),
        ins_viagem_destino: sql('carona/insert_viagem_destino.sql'),
        ins_viagem_origem: sql('carona/insert_viagem_origem.sql'),
        ins_viagem: sql('carona/insert_viagem.sql'),
        srch_viagemDataHoraOrigemDestinoVagas: sql('carona/search_viagem_data_hora_origem_destino_vagas.sql'),
        srch_viagemDataHoraOrigemDestino: sql('carona/search_viagem_data_hora_origem_destino.sql'),
        srch_viagemDataHoraOrigem: sql('carona/search_viagem_data_hora_origem.sql'),
        srch_viagemDataHoraDestino: sql('carona/search_viagem_data_hora_destino.sql'),
        srch_viagemDataOrigem: sql('carona/search_viagem_data_origem.sql'),
        srch_viagemDataDestino: sql('carona/search_viagem_data_destino.sql'),
        srch_viagemDataOrigemDestino: sql('carona/search_viagem_data_origem_destino.sql'),
        srch_viagemDataHoraOrigemVagas: sql('carona/search_viagem_data_hora_origem_vagas.sql'),
        srch_viagemDataHoraDestinoVagas: sql('carona/search_viagem_data_hora_destino_vagas.sql'),
        srch_viagemDataHoraVagas: sql('carona/search_viagem_data_hora_vagas.sql'),
        srch_viagemDataVagas: sql('carona/search_viagem_data_vagas.sql'),
        srch_viagemDataHora: sql('carona/search_viagem_data_hora.sql'),
        srch_viagemData: sql('carona/search_viagem_data.sql'),
        srch_viagemMotorista: sql('carona/search_viagem_motorista.sql'),
        srch_viagemPassageiro: sql('carona/search_viagem_passageiro.sql'),
        srch_reserva: sql('carona/search_reserva.sql'),
        select_localidades: sql('carona/select_localidade_descricao.sql'),
        update_viagemDia: sql('carona/update_dia.sql'),
        update_viagemHorario: sql('carona/update_horario.sql'),
        update_statusReserva: sql('carona/update_status_reserva.sql')
    },
    aluno: {
        consultar_por_nome: sql('aluno/consulta_aluno_nome.sql'),
        alteracao_email_aluno: sql('aluno/alteracao_email_aluno.sql'),
        alteracao_login_intranet_aluno: sql('aluno/alteracao_login_intranet_aluno.sql'),
        alteracao_nome_aluno: sql('aluno/alteracao_nome_aluno.sql'),
        consulta_aluno: sql('aluno/consulta_aluno.sql'),
        insert_aluno: sql('aluno/insert_aluno.sql'),
        remove_aluno: sql('aluno/remove_aluno.sql')
    },
    grade: {
        delete_aluno_turma: sql('grade/delete_aluno_turma.sql'),
        delete_evento_turma: sql('grade/delete_evento_turma.sql'),
        delete_horario_turma: sql('grade/delete_horario_turma.sql'),
        delete_horario: sql('grade/delete_horario.sql'),
        delete_pre_req: sql('grade/delete_pre_req.sql'),
        delete_professor: sql('grade/delete_professor.sql'),
        delete_turma: sql('grade/delete_turma.sql'),
        delete_uc: sql('grade/delete_uc.sql'),
        insert_aluno_turma: sql('grade/insert_aluno_turma.sql'),
        insert_evento_turma: sql('grade/insert_evento_turma.sql'),
        insert_horario_turma: sql('grade/insert_horario_turma.sql'),
        insert_horario: sql('grade/insert_horario.sql'),
        insert_pre_req: sql('grade/insert_pre_req.sql'),
        insert_professor: sql('grade/insert_professor.sql'),
        insert_turma: sql('grade/insert_turma.sql'),
        insert_uc: sql('grade/insert_uc.sql'),
        select_alunos_turma_tq_idturma: sql('grade/select_alunos_turma_tq_idturma.sql'),
        select_compromissos_compromisso_tq_raaluno: sql('grade/select_compromissos_compromisso_tq_raaluno.sql'),
        select_eventos: sql('grade/select_eventos.sql'),
        select_eventos_aluno_tq_raaluno: sql('grade/select_eventos_aluno_tq_raaluno.sql'),
        select_eventos_turma_tq_idturma: sql('grade/select_eventos_turma_tq_idturma.sql'),
        select_grade_aluno_tq_raaluno: sql('grade/select_grade_aluno_tq_raaluno.sql'),
        select_horarios_turma_tq_idturma: sql('grade/select_horarios_turma_tq_idturma.sql'),
        select_horarios: sql('grade/select_horarios.sql'),
        select_info_professor_tq_idprofessor: sql('grade/select_info_professor_tq_idprofessor.sql'),
        select_info_turma_tq_idturma: sql('grade/select_info_turma_tq_idturma.sql'),
        select_info_uc_tq_iduc: sql('grade/select_info_uc_tq_iduc.sql'),
        select_prereqs_uc_tq_iduc: sql('grade/select_prereqs_uc_tq_iduc.sql'),
        select_turmas_aluno_tq_raaluno: sql('grade/select_turmas_aluno_tq_raaluno.sql'),
        select_turmas_uc_tq_iduc: sql('grade/select_turmas_uc_tq_iduc.sql'),
        select_ucs: sql('grade/select_ucs.sql'),
        update_aluno_turma: sql('grade/update_aluno_turma.sql'),
        update_evento_turma: sql('grade/update_evento_turma.sql'),
        update_horario_turma: sql('grade/update_horario_turma.sql'),
        update_horario: sql('grade/update_horario.sql'),
        update_pre_req: sql('grade/update_pre_req.sql'),
        update_professor: sql('grade/update_professor.sql'),
        update_turma: sql('grade/update_turma.sql'),
        update_uc: sql('grade/update_uc.sql')
    }
    
    // // external queries for Users:
    // users: {
    //     add: sql('queries/users/create.sql'),
    //     search: sql('queries/users/search.sql'),
    //     report: sql('queries/users/report.sql'),
    // },
    // // external queries for Products:
    // products: {
    //     add: sql('queries/products/add.sql'),
    //     quote: sql('queries/products/quote.sql'),
    //     search: sql('products/search.sql'),
    // }
}