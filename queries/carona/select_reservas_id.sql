SELECT R.*, A.nome
FROM viagem V NATURAL JOIN 
    reserva R NATURAL JOIN
    aluno A
WHERE V.id_viagem = $1
AND R.id_passageiro = A.ra_aluno