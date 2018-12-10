SELECT * FROM viagem V NATURAL JOIN origem NATURAL JOIN destino
	aluno A ON V.id_motorista = A.ra_aluno
	WHERE viagem.dia = $1
	AND origem.id_origem = $2
	AND destino.id_destino = $3