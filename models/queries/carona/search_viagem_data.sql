SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
	WHERE viagem.dia = $1