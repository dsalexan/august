INSERT INTO horario_turma
SELECT t.id_turma, t.id_horario, STRING_AGG(sala, ', ') AS salas FROM (
  SELECT
    T.id_turma,
    H.id_horario,
    COALESCE(S.numero :: TEXT, S.nome_display, 'unknown') AS sala
  FROM turma T INNER JOIN
    visao_reserva R ON T.hash = R.hash_aula INNER JOIN
    horario H ON H.hora::TEXT = (R.inicio::TEXT || ':00') AND CONVERT_WEEKDAY(H.dia_semana::TEXT) = R.dia
    LEFT JOIN
    sala S ON R.id_sala = S.id_sala
  GROUP BY T.id_turma, H.id_horario, COALESCE(S.numero :: TEXT, S.nome_display, 'unknown')
  ORDER BY T.id_turma, H.id_horario, COALESCE(S.numero :: TEXT, S.nome_display, 'unknown')
) AS t
GROUP BY t.id_turma, t.id_horario;