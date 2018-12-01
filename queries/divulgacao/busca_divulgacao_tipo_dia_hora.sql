SELECT * FROM item_divulgacao
WHERE id_tipo = $1
AND dia = $2
WHERE hora_inicio >= $3