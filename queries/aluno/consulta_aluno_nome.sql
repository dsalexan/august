SELECT *
FROM aluno 
WHERE login_intranet = $1 AND senha_intranet = $2;