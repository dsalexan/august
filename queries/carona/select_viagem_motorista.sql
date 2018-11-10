SELECT viagem.*
FROM viagem NATURAL JOIN 
    origem NATURAL JOIN 
    destino
WHERE viagem.id_motorista = $1