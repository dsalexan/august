SELECT v.*, o.hora, o.id_origem, d.id_destino, r.id_passageiro, a.nome, r.status_reserva
FROM viagem v
LEFT JOIN origem o on o.id_viagem = v.id_viagem
LEFT JOIN destino d on d.id_viagem = v.id_viagem
LEFT JOIN reserva r on r.id_viagem = v.id_viagem AND r.id_origem = o.id_origem AND r.id_destino = d.id_destino
LEFT JOIN aluno a on a.ra_aluno = r.id_passageiro
    where v.id_motorista = $1
