var c = require('./Caronas');

var resposta = c.searchViagemDataHoraLocal('2018-09-03', '07:30', 2)
var resposta = c.searchViagemDataHora('2018-09-03', '07:30', 2)
//tem que arrumar a parte de retorno de multiple roles
var resposta = c.selectLocalidadeDescricao()

// console.log(c.searchViagemDataHoraLocal('2018-09-03', '07:30', 2))