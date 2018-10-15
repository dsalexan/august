SELECT * FROM viagem
WHERE viagem.dia = $1
AND viagem.id_viagem IN(
    SELECT id_viagem FROM origem
        WHERE origem.hora BETWEEN CAST ($2 AS TIME) - interval '2 hours' AND CAST ($2 AS TIME) + interval '2 hours'
)
AND viagem.id_viagem IN (
    SELECT id_viagem FROM destino
        WHERE destino.id_destino = $3
)
AND viagem.qtd_vagas >= $4