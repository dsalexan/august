SELECT * FROM mensagem
WHERE id_destinatario = $1
AND lida = 't'
ORDER BY dia, hora