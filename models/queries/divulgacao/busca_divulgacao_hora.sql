SELECT * FROM item_divulgacao
WHERE hora_inicio BETWEEN CAST ($1 AS TIME) - interval '1 hours' AND CAST ($1 AS TIME) + interval '1 hours'