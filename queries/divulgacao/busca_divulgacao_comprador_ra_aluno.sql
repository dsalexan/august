select i.descricao, i.dia, i.hora_fim, i.hora_inicio, i.id_divulgacao, r.id_reserva, i.nome, r.quantidade, a.nome as vendedor, i.valor
from reserva_divulgacao r INNER JOIN item_divulgacao i ON r.id_divulgacao = i.id_divulgacao
INNER JOIN aluno a ON a.ra_aluno = i.ra_aluno
WHERE r.ra_aluno_comprador = $1