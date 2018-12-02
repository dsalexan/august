SELECT A.hash, A.hash_uc, UC.nome, A.turma, A.professor, STRING_AGG(S.numero::TEXT, ', ') AS sala
FROM aula A LEFT JOIN
  unidade_curricular UC ON A.hash_uc = UC.hash LEFT JOIN
  visao_reserva R ON A.hash = R.hash_aula LEFT JOIN
  sala S ON R.id_sala = S.id_sala
WHERE A.hash_uc = ${hash_uc} AND
  R.dia = ${dia} AND
  R.inicio = ${inicio} AND
  A.pos = FALSE
GROUP BY A.hash, UC.nome;