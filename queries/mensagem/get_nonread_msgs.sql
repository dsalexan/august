SELECT * FROM mensagem
WHERE id_destinatario = $1
AND lida = 'f'
ORDER BY dia, hora