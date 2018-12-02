UPDATE item_divulgacao
SET quantidade = quantidade - $1
WHERE id_divulgacao = $2