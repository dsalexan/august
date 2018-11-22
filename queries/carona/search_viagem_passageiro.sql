SELECT v.*, r.*, o.hora FROM viagem v NATURAL JOIN origem o NATURAL JOIN reserva r
    WHERE id_viagem IN (
        SELECT id_viagem FROM reserva
        WHERE id_passageiro = $1)