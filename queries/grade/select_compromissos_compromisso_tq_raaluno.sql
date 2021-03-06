SELECT *
FROM compromissos As C
WHERE (C.ra_aluno = ${ra_aluno}
    OR (C.id_turma IN (
        SELECT ATu.id_turma
        FROM aluno_turma AS ATu
        WHERE ATu.ra_aluno = ${ra_aluno}
    )) AND C.tipo = 'evento')
    AND ((C.dia_semana IS NOT NULL) OR (C.dia IS NOT NULL AND C.dia BETWEEN ${data_inicio} AND ${data_fim}));