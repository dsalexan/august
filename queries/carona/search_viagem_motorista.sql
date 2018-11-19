SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
    where viagem.id_motorista = $1