SELECT T.id_turma, T.id_uc, T.id_professor, T.nome AS nome_turma, UC.nome AS nome_uc,
P.nome AS nome_prof, P.sala AS sala_prof, P.lattes AS lattes_prof, P.email1, P.email2
FROM turma AS T
    INNER JOIN uc AS UC
        ON T.id_uc = UC.id_uc
    INNER JOIN professor AS P
        ON T.id_professor = P.id_professor
WHERE T.id_turma = ${id_turma}