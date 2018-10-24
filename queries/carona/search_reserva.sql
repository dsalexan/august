SELECT * FROM viagem NATURAL JOIN reserva
    WHERE id_viagem = $1