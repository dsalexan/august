SELECT UC.*, ARRAY_AGG(A.alias) AS aliases
FROM unidade_curricular UC RIGHT JOIN
  uc_alias A on UC.hash = A.hash_uc
WHERE a.alias LIKE '%$1#%' OR REGEXP_REPLACE(a.alias, ' ', '', 'gi') LIKE '%$1#%'
GROUP BY UC.hash