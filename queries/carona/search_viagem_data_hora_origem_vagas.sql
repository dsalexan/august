SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
	WHERE viagem.dia = $1
	AND origem.hora BETWEEN CAST ($2 AS TIME) - interval '2 hours' AND CAST ($2 AS TIME) + interval '2 hours'
	AND origem.id_origem = $3
    AND viagem.qtd_vagas >= $4