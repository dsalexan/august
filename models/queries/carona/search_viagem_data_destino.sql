SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
    WHERE dia = $1
    AND id_destino = $2