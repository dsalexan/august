SELECT * FROM viagem V NATURAL JOIN origem NATURAL JOIN destino
	aluno A ON V.id_motorista = A.ra_aluno
    WHERE dia = $1
    AND id_destino = $2