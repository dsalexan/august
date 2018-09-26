SELECT *
FROM aluno 
WHERE nome = $1 AND senha_intranet = $2;