SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
	WHERE viagem.dia = $1
	AND viagem.qtd_vagas >= $2