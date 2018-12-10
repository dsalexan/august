SELECT * FROM viagem NATURAL JOIN origem NATURAL JOIN destino
	aluno A ON V.id_motorista = A.ra_aluno
	WHERE viagem.dia = $1
	AND viagem.qtd_vagas >= $2