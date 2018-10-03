SELECT H.dia_semana, H.hora, HT.sala
FROM horario_turma AS HT
    INNER JOIN horario AS H
        ON (HT.id_horario = H.id_horario)
WHERE HT.id_turma = ${id_turma}