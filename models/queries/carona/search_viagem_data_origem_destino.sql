SELECT * FROM viagem
WHERE viagem.dia = $1
AND viagem.id_viagem IN(
    SELECT id_viagem FROM origem
        WHERE origem.id_origem = $2
)
AND viagem.id_viagem IN (
    SELECT id_viagem FROM destino
        WHERE destino.id_destino = $3
)