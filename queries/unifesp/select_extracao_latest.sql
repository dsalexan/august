SELECT * 
FROM unifesp 
WHERE extracao = ${extracao}
ORDER BY datahora DESC
LIMIT 1