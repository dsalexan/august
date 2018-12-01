UPDATE reserva_sala
SET texto = ${texto},
    duracao = ${duracao},
    id_sala = ${id_sala},
    datahora = ${datahora},
    hash_aula = ${hash_aula},
    id_analise = ${id_analise}
WHERE id_reserva = ${id_reserva}