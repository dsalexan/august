UPDATE viagem
SET qtd_vagas = qtd_vagas+1
WHERE id_viagem = $1
