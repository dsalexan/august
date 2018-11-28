UPDATE sala
SET nome_original = ${original},
    nome_display = ${translation},
    numero = ${number},
    andar = ${floor},
    campus = ${campus},
    descricao = ${description},
    capacidade = ${capacity},
    id_analise = ${id_analise}
WHERE id_sala = ${id_sala}