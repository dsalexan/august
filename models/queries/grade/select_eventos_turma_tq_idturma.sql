SELECT *
FROM evento_turma
WHERE id_turma = $1
    AND id_aluno IS NULL