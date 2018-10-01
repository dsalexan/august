SELECT UC.nome, T.nome, ATu.faltas
FROM aluno_turma AS ATu
    INNER JOIN turma AS T
        ON ATu.id_turma =T.id_turma
    INNER JOIN uc AS UC
        ON T.id_uc = UC.id_uc
WHERE ATu.ra_aluno = ${ra_aluno}