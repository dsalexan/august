SELECT *
FROM viagem
WHERE id_viagem IN (
    SELECT id_viagem FROM reserva
    WHERE id_passageiro = $1)