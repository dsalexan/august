SELECT viagem.*, origem.hora, origem.id_origem, destino.id_destino
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
NATURAL JOIN viagem
NATURAL JOIN origem
NATURAL JOIN destino
WHERE viagem.id_motorista = $1

