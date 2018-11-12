const cheerio = require('cheerio')
const fs = require('fs')
const G = require('generatorics')

const CORPO_DOCENTE = 'section.entry-content'

// const MENU_UNIFESP_SELECTOR = '#menuPrivado li:nth-of-type(2) a'
// const UNIFESP_ATESTADO_SELECTOR = '#tbCorpoVisual tr:nth-of-type(15) td:nth-of-type(5) a'
// const IFRAME_CONSULTA_SELECTOR = '#iframe iframe'

// const PARAGRAPH_ATESTADO_SELECTOR = '#content p'
// const LINK_ATESTADO_SELECTOR = '#content p a'

// const CONTENT_ATESTADO_SELECTOR = '#content p.texto:nth-of-type(3)'
function containsObject(nome, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].nome === nome) {
            return true;
        }
    }

    return false;
}

var getProfs = function(page){
    return new Promise(async resolve => {
        $ = cheerio.load(await page.content())

        var professores = [];

        $('.entry-content table td:nth-of-type(2)').each(function(index, element){
            var prof = ($(element).text()).replace(new RegExp('Profª. |Profª.|Profa. |Profa.|Prof. |Prof.|Nome: ', 'g'), '')
                                          .replace(/\s/g, ' ').trim()

            var atributos = prof.split(new RegExp('\n|Área: |Email: |Email:|E-mail: | Sala: | Sala | Sala:|- Tel.| - Tel.| -Tel.| Tel.| - Parque', 'g'))

            var honorNome = atributos[0]
                                        
            var honorifico
            var nome

            if (honorNome.includes('Dr')) {
                honorifico = honorNome.split(' ')[0]
                nome = honorNome.split(' ').slice(1).join(' ')
            }
            else {
                honorifico = ''
                nome = honorNome
            }

            if (prof.length > 0) {

                var area = atributos[1]
                var email = atributos[2].trim()

                var emails = email.split(new RegExp(" ", 'g'))
                var email1 = emails[0]
                var email2 = null
                if (emails.length > 1)
                    email2 = emails[emails.length-1]

                var sala = atributos[3]
                var lattes = $(element).children("a:nth-last-of-type(1)").attr('href')
                if (lattes == undefined) {
                    lattes = $(element).children("p:nth-last-of-type(1)").children("a:nth-last-of-type(1)").attr('href')
                }
                if (lattes == undefined) {
                    lattes = ''
                }
                lattes = lattes.replace('http://%20http', 'http:')

                // console.log(area)
                // console.log({honorifico: honorifico, nome: nome})
                var profObj = {
                    nome: honorifico != '' ? honorifico + ' ' + nome : nome,
                    area: area,
                    email1: email1,
                    email2: email2,
                    lattes: lattes,
                    sala: sala
                }
                professores.push(profObj)
                // console.log(profObj)
            }
        })
        // console.log(professores.length)
        // console.log(professores)

        resolve(professores)
    })
}

module.exports = {
    getProfs: getProfs
}