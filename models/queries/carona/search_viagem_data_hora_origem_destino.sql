SELECT * FROM viagem
where viagem.dia = $1 AND (viagem.hora between time $2 - interval '2 hours' and time $2 + interval '2 hours') AND viagem.id_origem = $3 AND viagem.id_destino = $4
