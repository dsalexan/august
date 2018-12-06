SELECT *
FROM servico
WHERE ativo = TRUE AND nome LIKE $1