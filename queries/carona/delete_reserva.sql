DELETE FROM reserva
WHERE reserva.id_viagem = $1
AND reserva.id_passageiro = $2