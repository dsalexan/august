UPDATE horario_turma
SET sala = ${sala}
WHERE id_turma = ${id_turma},
    AND id_horario = ${id_horario}