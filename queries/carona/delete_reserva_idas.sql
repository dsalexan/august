DELETE FROM reserva r
USING origem o, viagem v
WHERE o.id_viagem = r.id_viagem
AND v.id_viagem = r.id_viagem
AND r.id_passageiro = $1
AND r.id_destino = 1
AND v.dia = $2
AND o.hora BETWEEN CAST ($3 AS TIME) - interval '1 hours' AND CAST ($3 AS TIME) + interval '1 hours'