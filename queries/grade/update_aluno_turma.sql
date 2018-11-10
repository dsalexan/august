UPDATE aluno_turma
SET id_turma = ${id_turma},
    faltas = ${faltas}
WHERE ra_aluno = ${ra_aluno}