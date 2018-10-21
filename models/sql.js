// File sql.js

// Proper way to organize an sql provider:
//
// - have all sql files for Users in ./sql/users
// - have all sql files for Products in ./sql/products
// - have your sql provider module as ./sql/index.js

const QueryFile = require("pg-promise").QueryFile;
const path = require("path");

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file); // generating full path;
    return (new QueryFile(fullPath, {minify: true}));
}

module.exports = {
    test: {
        get: sql("queries/test/get.sql")
    },
    users: {
        insert: sql("queries/users/insert.sql")
    },
    caronas: {
        del_reserva: sql('queries/carona/delete_reserva.sql'),
        del_viagem: sql('queries/carona/delete_viagem.sql'),
        get_all: sql('queries/carona/get_all.sql'),
        solic_reserva: sql('queries/carona/insert_reserva.sql'),
        ins_viagem_destino: sql('queries/carona/insert_viagem_destino.sql'),
        ins_viagem_origem: sql('queries/carona/insert_viagem_origem.sql'),
        ins_viagem: sql('queries/carona/insert_viagem.sql'),
        srch_viagemDataHoraOrigemDestinoVagas: sql('queries/carona/search_viagem_data_hora_origem_destino_vagas.sql'),
        srch_viagemDataHoraOrigemDestino: sql('queries/carona/search_viagem_data_hora_origem_destino.sql'),
        srch_viagemDataHoraOrigem: sql('queries/carona/search_viagem_data_hora_origem.sql'),
        srch_viagemDataHoraDestino: sql('queries/carona/search_viagem_data_hora_destino.sql'),
        srch_viagemDataOrigem: sql('queries/carona/search_viagem_data_origem.sql'),
        srch_viagemDataDestino: sql('queries/carona/search_viagem_data_destino.sql'),
        srch_viagemDataOrigemDestino: sql('queries/carona/search_viagem_data_origem_destino.sql'),
        srch_viagemDataHoraOrigemVagas: sql('queries/carona/search_viagem_data_hora_origem_vagas.sql'),
        srch_viagemDataHoraDestinoVagas: sql('queries/carona/search_viagem_data_hora_destino_vagas.sql'),
        srch_viagemDataHoraVagas: sql('queries/carona/search_viagem_data_hora_vagas.sql'),
        srch_viagemDataVagas: sql('queries/carona/search_viagem_data_vagas.sql'),
        srch_viagemDataHora: sql('queries/carona/search_viagem_data_hora.sql'),
        srch_viagemData: sql('queries/carona/search_viagem_data.sql'),
        srch_viagemMotorista: sql('queries/carona/search_viagem_motorista.sql'),
        srch_viagemPassageiro: sql('queries/carona/search_viagem_passageiro.sql'),
        srch_reserva: sql('queries/carona/search_reserva.sql'),
        select_localidades: sql('queries/carona/select_localidade_descricao.sql'),
        update_viagemDia: sql('queries/carona/update_dia.sql'),
        update_viagemHorario: sql('queries/carona/update_horario.sql'),
        update_statusReserva: sql('queries/carona/update_status_reserva.sql')
    },
    aluno: {
        consultar_por_nome: sql("queries/aluno/consulta_aluno_nome.sql"),
        alteracao_email_aluno: sql("queries/aluno/alteracao_email_aluno.sql"),
        alteracao_login_intranet_aluno: sql("queries/aluno/alteracao_login_intranet_aluno.sql"),
        alteracao_nome_aluno: sql("queries/aluno/alteracao_nome_aluno.sql"),
        consulta_aluno: sql("queries/aluno/consulta_aluno.sql"),
        insert_aluno: sql("queries/aluno/insert_aluno.sql"),
        remove_aluno: sql("queries/aluno/remove_aluno.sql")
    },
    grade: {
        delete_aluno_turma: sql('queries/grade/delete_aluno_turma.sql'),
        delete_evento_turma: sql('queries/grade/delete_evento_turma.sql'),
        delete_horario_turma: sql('queries/grade/delete_horario_turma.sql'),
        delete_horario: sql('queries/grade/delete_horario.sql'),
        delete_pre_req: sql('queries/grade/delete_pre_req.sql'),
        delete_professor: sql('queries/grade/delete_professor.sql'),
        delete_turma: sql('queries/grade/delete_turma.sql'),
        delete_uc: sql('queries/grade/delete_uc.sql'),
        insert_aluno_turma: sql('queries/grade/insert_aluno_turma.sql'),
        insert_evento_turma: sql('queries/grade/insert_evento_turma.sql'),
        insert_horario_turma: sql('queries/grade/insert_horario_turma.sql'),
        insert_horario: sql('queries/grade/insert_horario.sql'),
        insert_pre_req: sql('queries/grade/insert_pre_req.sql'),
        insert_professor: sql('queries/grade/insert_professor.sql'),
        insert_turma: sql('queries/grade/insert_turma.sql'),
        insert_uc: sql('queries/grade/insert_uc.sql'),
        select_alunos_turma_tq_idturma: sql('queries/grade/select_alunos_turma_tq_idturma.sql'),
        select_compromissos_compromisso_tq_raaluno: sql('queries/grade/select_compromissos_compromisso_tq_raaluno.sql'),
        select_eventos_aluno_tq_raaluno: sql('queries/grade/select_eventos_aluno_tq_raaluno.sql'),
        select_eventos_turma_tq_idturma: sql('queries/grade/select_eventos_turma_tq_idturma.sql'),
        select_grade_aluno_tq_raaluno: sql('queries/grade/select_grade_aluno_tq_raaluno.sql'),
        select_horarios_turma_tq_idturma: sql('queries/grade/select_horarios_turma_tq_idturma.sql'),
        select_horarios: sql('queries/grade/select_horarios.sql'),
        select_info_professor_tq_idprofessor: sql('queries/grade/select_info_professor_tq_idprofessor.sql'),
        select_info_turma_tq_idturma: sql('queries/grade/select_info_turma_tq_idturma.sql'),
        select_info_uc_tq_iduc: sql('queries/grade/select_info_uc_tq_iduc.sql'),
        select_prereqs_uc_tq_iduc: sql('queries/grade/select_prereqs_uc_tq_iduc.sql'),
        select_turmas_aluno_tq_raaluno: sql('queries/grade/select_turmas_aluno_tq_raaluno.sql'),
        select_turmas_uc_tq_iduc: sql('queries/grade/select_turmas_uc_tq_iduc.sql'),
        select_ucs: sql('queries/grade/select_ucs.sql'),
        update_aluno_turma: sql('queries/grade/update_aluno_turma.sql'),
        update_evento_turma: sql('queries/grade/update_evento_turma.sql'),
        update_horario_turma: sql('queries/grade/update_horario_turma.sql'),
        update_horario: sql('queries/grade/update_horario.sql'),
        update_pre_req: sql('queries/grade/update_pre_req.sql'),
        update_professor: sql('queries/grade/update_professor.sql'),
        update_turma: sql('queries/grade/update_turma.sql'),
        update_uc: sql('queries/grade/update_uc.sql')
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
};