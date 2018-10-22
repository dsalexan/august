INSERT INTO viagem (id_motorista, dia, preco, qtd_vagas, descricao) VALUES
($1, $2, $3, $4, $5)
RETURNING id_viagem