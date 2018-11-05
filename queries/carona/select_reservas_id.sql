SELECT R.* 
FROM viagem V NATURAL JOIN 
    reserva R
WHERE V.id_viagem = $1