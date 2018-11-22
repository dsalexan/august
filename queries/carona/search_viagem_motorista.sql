SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino LEFT JOIN reserva on reserva.id_viagem = viagem.id_viagem
    where viagem.id_motorista = $1