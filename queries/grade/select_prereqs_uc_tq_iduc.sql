SELECT PR.id_pre_req, UC.nome
FROM pre_req AS PR
    INNER JOIN uc AS UC
        ON PR.id_pre_req = UC.id_uc
WHERE PR.id_uc = ${id_uc}