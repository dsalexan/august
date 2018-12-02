SELECT T.*
FROM turma T LEFT JOIN
  uc UC ON T.id_uc = UC.id_uc
WHERE T.hash = $1