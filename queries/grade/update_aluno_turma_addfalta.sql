UPDATE aluno_turma SET faltas = faltas + 1 WHERE ra_aluno = ${ra_aluno} AND id_turma = ${id_turma}