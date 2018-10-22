SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
	WHERE viagem.dia = $1
	AND origem.id_origem = $2
	AND destino.id_destino = $3