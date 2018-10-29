SELECT V.*
FROM viagem V NATURAL JOIN 
	origem O NATURAL JOIN 
	destino D
WHERE viagem.dia = $1