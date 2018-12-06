# INDIA - **August**

<!-- TOC -->

- [INDIA - **August**](#india---august)
    - [Pendências](#pend%C3%AAncias)
        - [TESTES](#testes)
            - [Disclaimer](#disclaimer)
        - [APRESENTACAO](#apresentacao)
            - [Roteiro](#roteiro)
            - [Recursos](#recursos)

<!-- /TOC -->

## Pendências
----
### TESTES
#### Disclaimer
    O que estiver citado como <notificacao> em testes se refere às notificações push dos celulares, mt mais chique na moralzinha

- [ ] Grade
    - [ ] Login
        - [x] ~~*`funcionaliade`* Login nao existente~~
        - [x] ~~*`funcionaliade`* Login existente~~
        - [ ] *`funcionaliade`* Melhorar criptografia (*ponta a ponta, tem isso ai --dsalexan*)
        - [ ] *`funcionaliade`* Começar a autenticar as chamadas para a API com um JWT vindo do login (*da pra fazer isso? --dsalexan*)
        - [x] ~~*`funcionaliade`* Criptografar também o username do aluno~~
    - [ ] Perfil
        - [x] ~~Visualizar perfil~~
        - [ ] Alterar perfil
            - [x] ~~Modificar perfil~~
            - [ ] *`funcionaliade`* Adicionar coisas de perfil especifico pra piloto (placa e modelo por exemplo)
                - *utilizar um novo campo que eu adicionei em **aluno**, um JSONB DEAFULT '{}' chamado perfil --dsalexan* 
            - [ ] Melhorar o design da tela de modificar perfil, nao precisa daquele modal
        - [ ] Alterar politica de notificacoes (horarios, frequencia, pra q)
    - [ ] Grade
        - [ ] Visualizar aulas
            - [x] ~~Visualizar todas as aulas~~
            - [x] ~~Visualizar aula unica~~
                - [ ] Se certificar que o professor na aula ta de acordo com o **Corpo Docente** (site da unifesp)
                - [ ] Se certificar que ta mostrando a sala corretamente
            - [ ] Questionar aulas nao encontradas pela analise
                - [ ] Adicionar nova aula
                - [ ] Modificar aula existente
            - [ ] Remover aula
        - [ ] Visualizar todos os eventos
            - [x] ~~Visualizar todos os eventos de todas as aulas em um lugar~~
            - [x] ~~Visualizar eventos de uma aula~~
            - [x] ~~Adicionar eventos em uma aula~~
            - [ ] Modificar evento
            - [ ] Remover evento
            - [ ] *`funcionaliade`* Notificacao de evento em momentos especificos
        - [ ] Visualizar materias da grade
            - [ ] Visualizar todas as materias de um aluno
            - [ ] Visualizar data de inicio e fim do semestre
                - [ ] Mostrar estatisticas do quanto falta pro fim do semestre (*why not --dsalexan*)
            - [ ] Visualizar materia unica
                - [ ] Visualizar dados de uma materia espeficifica
                - [ ] Visualizar faltas
                - [ ] Modificar faltas
                    - [ ] *`funcionaliade`* Perguntar se esta na aula no horario
                - [ ] Visualizar eventos
                - [ ] Adicionar eventos
                - [ ] Adicionar materia
                - [ ] Modificar materia
                - [ ] Remover materia
    - [ ] Caronas
        - [ ] Visualizar caronas como carona
            - [x] ~~Lista com todas as caronas disponiveis~~
            - [ ] Buscas com filtro avancado
                - [ ] *`funcionaliade`* Lugares
                - [ ] *`funcionaliade`* Horario
                - [ ] *`funcionaliade`* Local de saida
                - [ ] *`funcionaliade`* Local de chegada
            - [ ] Reservar caronas
                - [x] Reservar uma carona especifica
                - [ ] *`funcionaliade`* Notificacoes para modificacao de estado da carona
        - [ ] Visualizar caronas como piloto (*é diferente do passageiro?? --dsalexan*)
            - [ ] Lista com todas as caronas disponiveis
            - [ ] Buscas com filtro avancado
                - [ ] *`funcionaliade`* Lugares
                - [ ] *`funcionaliade`* Horario
                - [ ] *`funcionaliade`* Local de saida
                - [ ] *`funcionaliade`* Local de chegada
            - [ ] Oferecer caronas
                - [x] ~~Oferecer uma carona~~
                - [ ] *`funcionaliade`* Notificacao para modificacao de estados de reservas
                - [ ] *`funcionaliade`* Opcao para ser ida e volta
                - [ ] *`funcionaliade`* Sugerir que o piloto bote uma foto caso nao possua uma
                - [ ] *`funcionaliade`* Sugerir que o piloto insira um picpay caso nao possua um cadastrado
                - [ ] *`funcionaliade`* Sugerir que o piloto informe a placa do carro caso nao haja uma cadastrada
            - [x] ~~Confirmar reservas de carona~~
            - [ ] Modificar carona
            - [x] ~~Excluir carona~~
        - [ ] Minhas caronas (historico de caronas passadas)
        - [ ] **`funcionalidade`** Colocar alarme de caronas, para lembrar o aluno de pedir uma carona. Talvez até sugerir alarmes com base nos horarios das primeiras aulas do dia.
    - [ ] Utilidades
        - [ ] Saldo RU
            - [x]  ~~Visualizar saldo ru~~
            - [ ] *`funcionalidade`* Criar um cronograma com todos os alunos cadastrados e espalhar atualizacoes de ru pelo dia para eficiencia
            - [x] ~~Botao para forcar atualizacao do saldo ru~~
                - [x] ~~*`funcionaliade`* Informar a ultima vez em que o saldo foi atualizado~~
        - [ ] Cardapio RU 
            - [x] ~~Visualizar cardapio~~
            - [ ] Melhorar o layout do cardapio RU
            - [ ] Ver cardapios passados
            - [ ] Mostrar estatisticas das comidas com base nos cardapios passado (*why not --dsalexan*)
                - [ ] *`funcionaliade`* Calcular essas estatisticas ao baixar o cardapio
                - [ ] *`funcionaliade`* Guardar o cardapio no banco
                - [ ] *`funcionaliade`* Baicar cardapio semanalmente todo domingo?
        - [ ] Histórico
            - [x] ~~Baixar historico~~
            - [ ] *`funcionaliade`* melhorar cara do historico pdf
        - [ ] Atestado
            - [ ] Baixar atestadoc
            - [ ] *`funcionaliade`* melhorar cara do atestado pdf
            - [ ] *`funcionaliade`* Baixar para a pasta downloads como o Android manda (*ios who cares --dsalexan*)
            - [ ] *`funcionaliade`* Escolher entre baixar do servidor ou pegar do local com base na data de vencimento do atestado
    - [ ] Divulgacao
        - [x] ~~Visualizar oferecimentos~~
        - [ ] Oferecer coisas
            - [x] ~~Oferecer um oferecimento especifico~~
            - [x] ~~Modificar coisas~~
            - [x] ~~Remover coisas~~
            - [ ] Confirmar reserva de coisa
                - [ ] *`funcionaliade`* Notificacao para reservas novas feitas
            - [ ] Estatisticas de adesao a coisa
        - [ ] Reservar coisas
            - [ ] Visualizar todas as coisas sendo ofertadas
            - [ ] Visualizar os dados de um oferecimento especifico
            - [x] ~~Reservar um oferecimento especifico~~
            - [ ] Remover reserva
            - [ ] *`funcionaliade`* Notificacao para modificacao de estado da reserva


### APRESENTACAO
----
- [ ] Criar um guia para tentar lidar com os erros bizarros do Ionic
- [ ] Roteiro ([goto](#roteiro))
- [ ] Montar slides - *os numeros do slide sao só uma previsao* ([recursos](#recursos))
    - [ ] HOJE
        - [ ] `1` Fazer video com os processos atuais de pegar os coiso nas intranet
        - [ ] `2` Após o video o primeiro slide tem que ser um só o com o logo e nome
        - [ ] `3` Ai vem o slide introdutório com os nomes de cada um
            - [ ] Arranjar uns icones pra cada um? Mt trampo?
        - [ ] `4` Slide com HOJE escrito grandao pra introduzir o topico
        - [ ] `5` Slide com as informacoes que a gente pega da unifeso (historico, atestado...) e exemplos de situacoes coditianas (nada de textos longos, só icones espirituosos)
    - [ ] NOSSO PROJETO
        - [ ] `6` Slide com NOSSO PROJETO grandao
        - [ ] `7` Slide com alguns numeros de tempo e cliques comparando o jeito atual com o nosso app e alguns icones que comparam PC X Mobile
        - [ ] `8` Slide com icone de email e um printscreen evidenciando o email que a gente enviou pra eles (provavelmente o print de uma caixa da gmail evidenciando pra kct só o email que enviamos)
    - [ ] SEGURANÇA DOS DADOS
        - [ ] `9` Slide com SEGURANÇA DOS DADOS grandao (*talvez um disclaimer escrito em algum lugar? --dsalexan*)
        - [ ] `10` Slides com transicoes bonitinhas para os sub-topics de seguranca de dados
    - [ ] NOSSO APLICATIVO
        - [ ] `11` Slide com NOSSO APLICATIVO grandao (talvez algum icone de voluntario ou app?)
        - [ ] `12` Slide com a senha para desbloquear o download do app
            - [ ] Descobrir algum servico online que faz isso, download bloqueado por senha
        - [ ] `13` Slide com APP escrito grandao e uns icones (esse tipo de slide vai ser para indicar que a gente vai migrar pro espelho do celular) `ref. LOGIN`
        - [ ] `14` Slide com links e falando sobre o JWT (icones, nao textao) `ref. LOGIN`
        - [ ] `15` Slide com diagrama explicando o nosso processo de compilar os dados de aulas e salas `ref. GRADE`
        - [ ] `16` Slide com a infraestrurura do projeto em icones nao texto, iniciar com postgresql, node, sql... com transicoes leves e ai transitar para **DIGITAL OCEAN** com um certo destaque `ref. DIVULGAÇÃO > INFRAESTRURURA DO PROJETO`
        - [ ] `17` Slide com especificidades do digital ocean, como alguns numeros de preco e specs da maquina e localizacao `ref. DIVULGAÇÃO > INFRAESTRURURA DO PROJETO`
        - [ ] `18` Slide com numeros de uso da nossa maquina no digital ocean e algumas previsoes numericas do quanto poderia custar um servidor para aplicacao na realidade `ref. DIVULGAÇÃO > INFRAESTRURURA DO PROJETO`
        - [ ] MONETIZAÇÃO
            - [ ] `19` Slide com monetização escrito, menos destaque do que os destaques de eixo
            - [ ] `20` Icones exemplificando pequenos empreendimentos que poderiam utilizar nosso **EIXO DIVULGACAO**
            - [ ] `21` Transicao legal para icones exemplificando empreendimentos maiores externos que poderiam utilizar nossa aba divulgacao
            - [ ] `22` Mostrar alguns números que falam sobre o nosso demographics e outros que validem que o nosso demographics compra coisa e engaja bastante anuncio
            - [ ] `23` Slide com icones pra falar da diferenca entre a nossa aba com monetizacao e um GoogleAds ou Facebook Ads
    - [ ] FUTURO
        - [ ] `24` Slide com FUTURO escrito grandao (*algum delorean em icone talvez? --dsalexan*)
        - [ ] `25` Slide com transicoes e icones para os subtopics e subsubtopics de Futuro
    - [ ] `26` Slide com nossos nomes e emails no estilao do primeiro slide que a gente apresentou
- [ ] Testar condicoes ideiais para AirDroid
- [ ] Testar a maneira de uso dos dois computadores (vamos precisar de um para o espelho do celular e outro para mostrar resultados de pesquisa do banco)
    - [ ] Vai ter que ter um esquema pratico para trocar de tela do app -> tela do powerpoint -> tela do datagrip
- [ ] Ensaiar apresentacao
    - [ ] Definir topicos de fala pra cada um
    - [ ] Definir highlights dos topicos que merecem enfoques especiais
- [ ] **Existe algo que a gente possa fazer pra diminuir a claridade das janelas da 403?**

#### Roteiro
1. **`HOJE`**. Falar sobre a dificuldade em acessar certas informacoes espalhadas pelos varios portais da UNIFESP. Dentre essas informacoes, citar: historico, atestado, saldo do ru, cardapio do ru, aulas, salas da aulas, professores... Argumentar com exemplos de situacoes cotidianas onde é necessário um acesso rápido a esses dados: cinema, comprar ru em cima da hora, provas (salas e horarios), datas de entregas de trabalho...
    - *comecar a apresentação com o vídeo, e fazer a introducao depois*
    - *na introducao é importante quem estiver falando entregar as "credenciais" do projeto antes de trocar de topico: "pegar todas essas informações hoje é um processo confuso e lento. a gente ta aqui pra entregar um novo jeito mais rapido e mais fácil" ou algo assim*
2. **`NOSSO PROJETO`**. Falar que todos (ou a maiora) dessas informacoes sao acessadas com as mesmas credenciais - o problema é a falta de um acesso ainda mais centralizado e a falta de eficiencia do que ja existe. O nosso projeto é criar esse ambiente centralizado, reunir as informaçoes espalhadas em um só lugar para acesso rápido e prático.
    - **`APK`**. Enviar um link para o email de todos os alunos com o apk para download. Na verdade travar o download com uma senha especifica pra nao deixar os apressados ja irem logando sem antes ouvir o *disclaimer* sobre seguranca de dados. Especificar que esse **beta run** só funcionará durante a aula (ou apresentacao). **A gente pode só mostrar o link também, mas o link aparecer no email é bem mais *cool***
        - *descobrir uma lista de emails. da pra usar a lista de alunos que a gente tem?*
3. **`SEGURANÇA DOS DADOS`**. Um dos aspectos mais importantes do que nos propusemos a fazer é a segurança dos dados. Precisamos lidar com as senhas do usuário para automatizar os processos da UNIFESP, e portanto é necessário ter certeza de que esses dados estão protegidos e de que não serão abusados. 
    - **`APLICATIVO SEGURO`**. Falar que o nosso app só pede o minimo de permissões do celular (*provavelmente só o de gerenciar arquivos, mas ai sei la ne --dsalexan*)
    - **`SENHAS CRIPTOGRAFADAS`**. No momento em que o usuário loga no app suas credenciais sao criptografadas com uma chave secreta que só o APP e o servidor conhecem. Explicar que dessa maneira todas requisições que envolvem as credenciais do aluno (o login nesse caso) só lidam com dados criptografados, mesmo que alguem intercepte a requisicao (em redes abertas como wifi publicos) nao seria possivel ler os dados. (*cozinhar melhores argumentos, ta fraco ainda --dsalexan*)
        - *nesse ponto rodar uma query no banco de dados e mostrar a tabela aluno pra todo mundo*
    - **`SERVIDOR ISOLADO`**. Explicar que quaisquer movimentações que exijam as credenciais do aluno são executadas no nosso servidor, que só pode ser acessado por meio de chamadas em sua API autenticadas e que informam os dados estritamente necessários.
4. **`NOSSO APLICATIVO`**. Pedir um **voluntario** da sala para utilizar nosso app. Alguem vai com um celular com o apk ja instalado e sincronizado com o AirDroid para que a sala possa ver o uso do app. O voluntario só vai logar, a manipulação do app vai ser nossa mesmo. O máximo que ele vai fazer é confirmar que o que ta aparecendo é veridico. **Assim que logar deve mostrar uma notificação informando a apresentação dos trabalhos de Engenharia de Software, atentar a audiencia para essa notificação e dizer que mais pra frente a gente fala dela.**
    - *nesse ponto mostrar a senha para liberar o download do apk pelo link do email* 
    1. **`LOGIN`**. Explicar o processo no login dentro do nosso servidor. Que ele tem que ir na intranet, verificar se existe no banco, importar historico e atestado, tralala...
        - *nesse ponto abrir algum site de JWT e explicar o JWT e como ele funciona como uma camada a mais de segurança dentro do nosso serviço de API (o servidor august)* 
    2. **`PERFIL`**. Mostrar o perfil do aluno.
    3. **`GRADE`**. Mostrar as aulas do aluno e falar sobre a dificuldade em compilar esses dados. Falar que nosso método ainda não é perfeito (lidar com as indiossincrasias e typos é complicado) e que os proprios aluons podem contribuir com o refinamento dos dados ao informar para o app as aulas e dados que faltam.
        - *nesse ponto buscar no banco os logs e tabelas com as extracoes das ementas, agenda e atestado, falar também sobre os casos especificos onde o atestado pode vir incompleto*
        - *mostrar um diagrama de como o nosso algoritmo compila todos os dados de diferentes fontes*
    4. **`CARONAS`**. Falar sobre a pouca praticidade em ter que acessar o Facebook para algo como o transporte para a faculdade (citar outros problemas, nao relacionados ao facebook, como: conseguir caronas em cima da hora, esquecer de pedir carona com antecedencia) Mostrar as interfaces de carona e os processos para se oferecer ou pedir uma carona. 
        - **`ALARMES`**. Citar a possibilidade dos alarmes de caronas
        - **`RECONHECER O MOTORISTA`**. Falar que no nosso app o motorista a foto de perfil do piloto pode ser muito mais clara (já que nao está ligada a uma rede social (*arrumar um argumento melhor aqui tambem --dsalexan*)) e que ele também pode informar a placa do carro automaticamente, o que facilita o reconhecimento.
        - **`FILTROS AVANÇADOS`**. Nossa interface de caronas possui filtros especificos para as informações importantes de uma carona, o que facilita a escolha da opção ideal.
    5. **`UTILIDADES`**. Mostrar as opcoes da interface de utilidades.
        - *nesse ponto abrir o banco e mostrar o cronograma de execucoes automaticas (**espero que isso ja exista ate la**) que espalha execucoes automaticas de codigos de recuperam dados da UNIFESP para melhorar o desempenho e a velocidade de exibicao dos dados quando um aluno pede no app*  
    6. **`DIVULGAÇÃO`**. Mostrar as opcoes da interface de divulgação.
        - **`INFRAESTRUTURA DO PROJETO`**. Fazer um pequeno parentese no eixo de divulgação para explicar a infraestrutura do nosso projeto (iniciar o topico com algo mais *light* como bla bla postgreSQL bla bla Node.JS bla bla javascript e depois chegar na questao do **Digital Ocean**). Falar que é um servidor com toda a liberdade que a gente precisava, mas que é pago. Alias, 5 doletas ao mês no plano super minimo.
            - *citar meio en passant que a gente pegou essa grana com um pacote para estudantes, mas mt en passant mesmo*
        - **`MONETIZAÇÃO`**. Chegar entao na parte importante, que é a monetizacao. Falar que a aba de divulgação abre a oportunidade para pequenos empreendimentos (um espaço gratuito de promoção para seus produtos) mas que também é um ponto focal para **anuncios pagos**. O demographics que utiliza esse aplicativo é um grupo atrativo para diversas areas, e vender anuncios para serem colocados dentro da nossa plataforma de divulgação é uma possibilidade bem real.
            - *falar sobre a diferença entre a nossa interface de divulgacao veicular anuncios pagos e o Google Ads ou o Facebook Ads por exemplo, provavelmente falar algo sobre os algoritmos de analise de perfil publicitario do fb ou google?*
            - *nessa parte de demographics mostrar numeros e graficos, vai ficar **cool***
    7. **`FUTURO`**. Falar sobre as futuras possibilidades do projeto.
        - **`PROFESSORES`**. Traduzir o atual sistema de albuns no facebook para o app, onde os alunos podem **opinar** (nao xingar) sobre os professores e suas determinadas matérias (também ranquear fatores como dificuldade e talz)
            - **`SUGESTÃO DE GRADE HORÁRIA`**. Junto a dados avaliando materias especificas e histórico de aulas do aluno é possivel utilizar algoritmos envolvendo inteligencia computacional para sugerir grades semestrais para os alunos na epoca de rematricula.
        - **`EVENTOS`**. Um eixo especifico para eventos internos ou externos a faculdade. Coisas como festas, palestras, reuniões poderiam ser organizadas e divulgadas dentro do app (onde nosso aplicativo poderia gerenciar coisas como estatisticas de adesão ao evento, listas de presenças, divulgação especializada).
5. **`FECHAMENTO`**. Terminar a apresentação falando sobre as nossas intenções de realmente terminar o app e libera-lo na unifesp (*na moral a gente vai fazer isso msm? --dsalexan*). **O QUE MAIS???**

#### Recursos

- [How to Quickly Make a Wonderful PowerPoint Presentation | PowerPoint Skills](https://www.youtube.com/watch?v=_N7SZ7TBgCY)
- [How to Quickly Design a Beautiful PowerPoint Presentation | PowerPoint Skills](https://www.youtube.com/watch?v=SVYwKXPBb7w)
- [Apresentação de Slides - Agosto | Acessa](https://docs.google.com/presentation/d/1rMAXY2-9cKTC5LJPXTJx_bxNQzkl4aNnEhCF9mKplU4/edit#slide=id.p1)