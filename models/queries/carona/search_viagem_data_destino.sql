SELECT * FROM viagem
where dia = $1
AND id_viagem IN (
    SELECT id_viagem FROM destino
        WHERE id_destino = $2
)