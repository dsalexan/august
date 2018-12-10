SELECT * FROM viagem V NATURAL JOIN origem NATURAL JOIN destino
	aluno A ON V.id_motorista = A.ra_aluno
	WHERE viagem.dia = $1
	AND origem.hora BETWEEN CAST ($2 AS TIME) - interval '2 hours' AND CAST ($2 AS TIME) + interval '2 hours'
	AND origem.id_origem = $3