SELECT A.*
FROM analise A LEFT JOIN
  unifesp U ON (A.base = U.id_extracao)
WHERE U.extracao = $1
ORDER BY A.datahora DESC