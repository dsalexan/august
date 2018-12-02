SELECT *
FROM atestado
WHERE ra_aluno = $1
ORDER BY datahora DESC
LIMIT 1