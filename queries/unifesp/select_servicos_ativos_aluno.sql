SELECT *
FROM servico
WHERE ativo = TRUE AND nome LIKE ${nome} AND ra_aluno = ${ra_aluno}