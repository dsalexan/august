// File sql.js

// Proper way to organize an sql provider:
//
// - have all sql files for Users in ./sql/users
// - have all sql files for Products in ./sql/products
// - have your sql provider module as ./sql/index.js

const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file); // generating full path;
    return new QueryFile(fullPath, {minify: true});
}

module.exports = {
    test: {
        get: sql('queries/test/get.sql')
    },
    users: {
        insert: sql('queries/users/insert.sql')
    },
    caronas: {
        get_all: sql('queries/carona/get_all.sql'),
        del_viagem: sql('queries/carona/delete_viagem.sql'),
        ins_viagem: sql('queries/carona/insert_viagem.sql'),
        srch_viagemDataHoraLocal: sql('queries/carona/search_viagem_data_hora_local.sql'),
        srch_viagemDataHora: sql('queries/carona/search_viagem_data_hora.sql'),
        srch_viagemMotorista: sql('queries/carona/search_viagem_motorista.sql'),
        srch_viagemPassageiro: sql('queries/carona/search_viagem_passageiro.sql'),
        select_localidadesDescricao: sql('queries/carona/select_localidade_descricao.sql'),
        select_localidade: sql('queries/carona/select_localidade.sql'),
        update_viagemDia: sql('queries/carona/update_dia.sql'),
        update_viagemHorario: sql('queries/carona/update_horario.sql')

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