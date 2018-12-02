INSERT INTO uc (nome, creditos)
SELECT nome,
  CASE
    WHEN carga = '108h' THEN 6
    WHEN carga = '72h' THEN 4
    ELSE 2
  END AS creditos
FROM unidade_curricular
ORDER BY nome