SELECT count(*)*MIN(uc.creditos)/2 AS qtd, concat(uc.nome, ' - ', MIN(T.nome)) AS nome
FROM turma T
  INNER JOIN uc ON uc.id_uc = T.id_uc
  INNER JOIN aluno_turma AT ON T.id_turma = AT.id_turma
  INNER JOIN aluno A ON A.ra_aluno = AT.ra_aluno
WHERE A.ra_aluno = ${ra_aluno}
GROUP BY UC.nome
UNION
SELECT count(*) AS qtd, 'Caronas (passageiro)' AS nome
FROM reserva R
  INNER JOIN viagem V ON V.id_viagem = R.id_viagem
WHERE R.id_passageiro = ${ra_aluno}
  AND R.status_reserva = true
  AND V.dia BETWEEN ${data_inicio} AND ${data_fim}
GROUP BY R.id_passageiro
UNION
SELECT count(*) AS qtd, 'Caronas (motorista)' AS nome
FROM reserva R
  INNER JOIN viagem V ON V.id_viagem = R.id_viagem
WHERE V.id_motorista = ${ra_aluno}
  AND R.status_reserva = true
  AND V.dia BETWEEN ${data_inicio} AND ${data_fim}
GROUP BY V.id_motorista
UNION
SELECT count(*) AS qtd, E.descricao AS nome
FROM aluno_turma AT
  INNER JOIN turma T ON AT.id_turma = T.id_turma
  INNER JOIN evento_turma ET on T.id_turma = ET.id_turma
  INNER JOIN evento E ON E.id_evento = ET.id_evento
WHERE AT.ra_aluno = ${ra_aluno}
  AND ET.data BETWEEN ${data_inicio} AND ${data_fim}
GROUP BY E.descricao;