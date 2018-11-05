UPDATE professor
SET nome = ${nome},
    sala = ${sala},
    lattes = ${lattes},
    email1 = ${email1},
    email2 = ${email2}
WHERE id_professor = ${id_professor}