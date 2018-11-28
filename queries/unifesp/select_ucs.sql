SELECT UC.*, ARRAY_AGG(A.alias) AS aliases
FROM unidade_curricular UC RIGHT JOIN
  uc_alias A on UC.hash = A.hash_uc
GROUP BY UC.hash