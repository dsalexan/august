SELECT * FROM viagem
where viagem.dia = $1
AND viagem.qtd_vagas >= $2