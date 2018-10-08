-- SELECT * FROM viagem
-- where viagem.dia = '2018-10-29' AND (viagem.hora between time '12:47' - interval '2 hours' and time '12:47' + interval '2 hours') AND viagem.id_origem = 2;

-- SELECT *
-- FROM viagem
-- WHERE viagem.dia = $1
-- AND viagem.hora BETWEEN CAST ($2 AS TIME) - INTERVAL '2 hours' AND CAST ($2 AS TIME) + INTERVAL '2 hours'
-- AND viagem.id_origem = $3;


SELECT * FROM viagem
where viagem.dia = $1
AND viagem.hora BETWEEN CAST ($2 AS TIME) - interval '2 hours' AND CAST ($2 AS TIME) + interval '2 hours'
AND viagem.id_origem = $3
AND viagem.id_destino = $4