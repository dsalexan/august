SELECT V.*, O.*, D.*
FROM viagem V NATURAL JOIN 
	origem O NATURAL JOIN 
	destino D
WHERE V.dia = $1