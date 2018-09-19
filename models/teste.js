var c = require('./Caronas');

var resposta = c.searchViagemDataHoraLocal('2018-09-03', '07:30', 2)
var resposta = c.searchViagemDataHora('2018-09-03', '07:30')
var resposta = c.selectLocalidadeDescricao()
var resposta = c.selectLocalidade('UNIFESP')
//var resposta = c.updateHorarioViagem('09:30:00', 1)
//var resposta = c.updateHorarioViagem('07:30:00', 1)