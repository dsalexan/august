UPDATE reserva
SET status_reserva = $1
WHERE reserva.id_viagem = $2