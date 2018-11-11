UPDATE unidade_curricular
SET nome = ${nome},
    arquivo = ${arquivo},
    carga = ${carga},
    requisitos = ${requisitos}
WHERE hash = ${hash}