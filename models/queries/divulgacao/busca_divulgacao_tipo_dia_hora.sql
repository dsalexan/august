SELECT * FROM item_divulgacao
WHERE id_tipo = $1
AND dia = $2
WHERE hora_inicio BETWEEN CAST ($3 AS TIME) - interval '1 hours' AND CAST ($3 AS TIME) + interval '1 hours'