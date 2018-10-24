SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
    WHERE id_viagem IN (
        SELECT id_viagem FROM reserva
        WHERE id_passageiro = $1)