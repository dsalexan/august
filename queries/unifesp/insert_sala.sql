INSERT INTO sala 
VALUES (DEFAULT, ${original}, ${translation}, ${number}, ${floor}, ${campus}, ${description}, ${capacity}, ${id_analise})
RETURNING id_sala