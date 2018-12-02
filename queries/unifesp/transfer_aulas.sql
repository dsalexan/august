INSERT INTO turma (id_uc, id_professor, nome, hash)
SELECT U.id_uc, 1 AS id_professor, COALESCE(A.turma, '-') AS nome, A.hash
FROM unidade_curricular UC LEFT JOIN
  uc U ON UC.nome = U.nome INNER JOIN
  aula A ON UC.hash = A.hash_uc
WHERE UC.hash != -284840886
ORDER BY U.id_uc
