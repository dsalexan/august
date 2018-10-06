-- SELECT * FROM viagem
-- where viagem.dia = '2018-10-29' AND (viagem.hora between time '12:47' - interval '2 hours' and time '12:47' + interval '2 hours') AND viagem.id_origem = 2;


SELECT * FROM viagem
where viagem.dia = $1
AND viagem.hora BETWEEN TIME $2 + interval '2 hours' AND TIME $2 + interval '2 hours'
AND viagem.id_origem = $3
AND viagem.id_destino = $4;