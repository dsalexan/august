SELECT *
FROM saldo_ru
WHERE ra_aluno = $1
ORDER BY datahora DESC
LIMIT 1