UPDATE unidade_curricular
SET nome = ${nome},
    arquivo = ${arquivo},
    carga = ${carga},
    requisitos = ${requisitos},
    id_analise = ${id_analise}
WHERE hash = ${hash}