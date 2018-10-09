SELECT * FROM item_divulgacao
WHERE dia = $1
AND hora_inicio BETWEEN CAST ($2 AS TIME) - interval '1 hours' AND CAST ($2 AS TIME) + interval '1 hours'