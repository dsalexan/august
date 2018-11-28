SELECT * 
FROM viagem NATURAL JOIN 
    origem NATURAL JOIN 
    destino NATURAL JOIN
    reserva
WHERE id_passageiro = $1