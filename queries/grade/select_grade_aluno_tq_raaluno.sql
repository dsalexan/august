SELECT UC.nome AS nome_uc, T.nome AS turma, H.dia_semana, H.hora, HT.sala
FROM uc AS UC
    INNER JOIN turma AS T
        ON UC.id_uc = T.id_uc
    INNER JOIN horario_turma AS HT
        ON T.id_turma = HT.id_turma
    INNER JOIN horario AS H
        ON HT.id_horario = H.id_horario
    INNER JOIN aluno_turma AS ATu
        ON T.id_turma = ATu.id_turma
WHERE ATu.ra_aluno = ${ra_aluno}
    ORDER BY H.dia_semana ASC,
        H.hora ASC