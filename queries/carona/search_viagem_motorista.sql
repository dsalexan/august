SELECT viagem.*, origem.hora, origem.id_origem, destino.id_destino, A.nome
FROM (
    SELECT origem.id_viagem, MIN(origem.hora) as hora
    FROM origem
    GROUP BY origem.id_viagem
    ) AS menor_hora
NATURAL JOIN (
    SELECT destino.id_viagem, MAX(destino.id_destino) as id_destino
    FROM destino
    GROUP BY destino.id_viagem
    ) AS destino_unico
NATURAL JOIN viagem V
NATURAL JOIN origem
NATURAL JOIN destino
	aluno A ON V.id_motorista = A.ra_aluno
WHERE viagem.id_motorista = $1

