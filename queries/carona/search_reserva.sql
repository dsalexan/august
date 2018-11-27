SELECT a.nome, a.ra_aluno, r.id_origem, o.hora, r.id_destino, r.status_reserva
FROM viagem v
NATURAL JOIN reserva r
NATURAL JOIN aluno a
NATURAL JOIN origem o
    WHERE id_viagem = $1
    AND a.ra_aluno = r.id_passageiro
    AND o.id_viagem = $1
    AND r.id_origem = o.id_origem