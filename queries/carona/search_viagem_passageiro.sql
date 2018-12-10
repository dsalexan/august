SELECT a.nome, v.*, r.*, o.hora, a.nome FROM viagem v NATURAL JOIN origem o NATURAL JOIN reserva r NATURAL JOIN aluno a
    WHERE id_viagem IN (
        SELECT id_viagem FROM reserva
        WHERE id_passageiro = $1)
    AND v.id_motorista = a.ra_aluno AND id_passageiro = $1