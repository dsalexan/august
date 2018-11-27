SELECT v.id_viagem, r.status_reserva
FROM viagem v
NATURAL JOIN reserva r
WHERE v.id_motorista = $1