SELECT a.nome, r.* FROM reserva_divulgacao r INNER JOIN aluno a ON r.ra_aluno_comprador = a.ra_aluno
WHERE r.id_divulgacao = $1