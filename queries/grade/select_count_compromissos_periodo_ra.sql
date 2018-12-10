
SELECT *  FROM (
  SELECT
    concat(uc.nome, ' - ', MIN(T.nome))     AS nome,
    'aulas'                                 AS tipo,
    ARRAY ['aula']                          AS dados,
    --PARSE_INT_WEEKDAY(H.dia_semana :: TEXT) AS valor_dia,
    (CURRENT_DATE + PARSE_INT_WEEKDAY(H.dia_semana :: TEXT) - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER) AS data,
    display_weekday(H.dia_semana :: TEXT)   AS dia,
    H.hora                                  AS hora
  FROM turma T
    LEFT JOIN horario_turma HT ON T.id_turma = HT.id_turma
    LEFT JOIN horario H ON HT.id_horario = H.id_horario
    INNER JOIN uc ON uc.id_uc = T.id_uc
    INNER JOIN aluno_turma AT ON T.id_turma = AT.id_turma
    INNER JOIN aluno A ON A.ra_aluno = AT.ra_aluno
  WHERE A.ra_aluno = ${ra_aluno}
  GROUP BY UC.nome, H.dia_semana, H.hora
  UNION
  SELECT *
  FROM (
         SELECT
           concat(L.descricao, ' -> ', D.descricao)                                AS nome,
           'caronas'                                                               AS tipo,
           ARRAY ['reservadas', INITCAP(A.nome), A.perfil -> 'carro' ->> 'modelo'] AS dados,
           V.dia                                 AS data,
           DOW_TO_WEEKDAY(EXTRACT(DOW FROM V.dia) :: INTEGER)                      AS dia,
           O.hora                                                                  AS hora
         FROM reserva R
           INNER JOIN viagem V ON V.id_viagem = R.id_viagem
           LEFT JOIN aluno A ON V.id_motorista = A.ra_aluno
           INNER JOIN origem O ON V.id_viagem = O.id_viagem
           INNER JOIN destino _D ON V.id_viagem = _D.id_viagem
           LEFT JOIN localidade L ON O.id_origem = L.id_local
           LEFT JOIN localidade D ON _D.id_destino = D.id_local
         WHERE R.id_passageiro = ${ra_aluno}
               AND R.status_reserva = true
               AND V.dia BETWEEN ${data_inicio} AND ${data_fim}
         GROUP BY R.id_passageiro, V.id_viagem, O.hora, A.ra_aluno, L.descricao, D.descricao
         UNION
         SELECT
           concat(L.descricao, ' -> ', D.descricao)                                                  AS nome,
           'caronas'                                                                                 AS tipo,
           ARRAY ['oferecidas', (V.qtd_vagas - COUNT(R.id_passageiro)) :: TEXT, V.qtd_vagas :: TEXT] AS dados,
           V.dia                                              AS data,
           DOW_TO_WEEKDAY(EXTRACT(DOW FROM V.dia) :: INTEGER)                                        AS dia,
           O.hora                                                                                    AS hora
         FROM viagem V
           INNER JOIN origem O ON V.id_viagem = O.id_viagem
           INNER JOIN destino _D ON V.id_viagem = _D.id_viagem
           LEFT JOIN localidade L ON O.id_origem = L.id_local
           LEFT JOIN localidade D ON _D.id_destino = D.id_local
           LEFT JOIN reserva R ON V.id_viagem = R.id_viagem AND R.status_reserva = true
         WHERE V.id_motorista = ${ra_aluno}
               AND V.dia BETWEEN ${data_inicio} AND ${data_fim}
         GROUP BY V.id_motorista, V.id_viagem, O.hora, L.descricao, D.descricao
       ) AS _caronas
  UNION
  SELECT
    ET.descricao                                         AS nome,
    'eventos'                                            AS tipo,
    ARRAY [E.descricao, MIN(UC.nome)]                    AS dados,
    ET.data                 AS data,
    DOW_TO_WEEKDAY(EXTRACT(DOW FROM ET.data) :: INTEGER) AS dia,
    ET.hora                                              AS hora
  FROM aluno_turma AT
    INNER JOIN turma T ON AT.id_turma = T.id_turma
    LEFT JOIN uc AS UC ON T.id_uc = UC.id_uc
    INNER JOIN evento_turma ET on T.id_turma = ET.id_turma
    INNER JOIN evento E ON E.id_evento = ET.id_evento
  WHERE AT.ra_aluno = ${ra_aluno}
        AND ET.data BETWEEN ${data_inicio} AND ${data_fim}
  GROUP BY E.descricao, ET.id_evento_turma
) AS super_view_coisas_aluno_faz
ORDER BY data, hora;