INSERT INTO schedule
VALUES (DEFAULT, ${servico}, ${args}, ${datahora}, ${repetir}, null)
RETURNING *