SELECT ATu.ra_aluno, A.nome
FROM aluno_turma AS ATu
    INNER JOIN aluno AS A
        ON ATu.ra_aluno = A.ra_aluno
WHERE ATu.id_turma = ${id_turma}