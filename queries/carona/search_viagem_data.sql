SELECT V.*, O.*, D.*, A.nome
FROM viagem V NATURAL JOIN 
	origem O NATURAL JOIN 
	destino D LEFT JOIN
	aluno A ON V.id_motorista = A.ra_aluno
WHERE V.dia = $1