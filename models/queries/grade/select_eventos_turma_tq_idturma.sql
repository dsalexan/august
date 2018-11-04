SELECT E.descricao AS descricao_evento, ET.data, ET.hora, ET.sala, ET.descricao AS descricao_evento_turma
FROM evento_turma AS ET
    INNER JOIN evento AS E
        ON ET.id_evento = E.id_evento
WHERE id_turma = $/id_turma/