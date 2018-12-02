UPDATE aula
SET hash_uc = ${hash_uc},
    turma = ${turma},
    professor = ${professor},
    responsavel = ${responsavel},
    monitoria = ${monitoria},
    aula = ${aula},
    reposicao = ${reposicao},
    pos = ${pos},
    id_analise = ${id_analise}
WHERE hash = ${hash}