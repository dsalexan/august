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

        $('.entry-content table td:nth-of-type(2) p:nth-of-type(1)').each(function(index, element){
            var prof = $(element).text().replace(/\n/g, '')
                                        .replace(/Profª. /g, '')
                                        .replace(/Profª./g, '')
                                        .replace(/Profa. /g, '')
                                        .replace(/Profa./g, '')
                                        .replace(/Prof. /g, '')
                                        .replace(/Prof./g, '')
                                        .replace(/Nome: /g, '')
                                        .replace(/\s/g, ' ')
                                        .trim()
            var honorifico
            var nome
            // if (prof.includes('Lilian')) {
            //     honorifico = 'Dra.'
            //     nome = 'Lilian Berton'
            // }
            if (prof.includes('Dr')) {
                honorifico = prof.replace(new RegExp('&nbsp;', 'g'), ' ').split(' ')[0]
                nome = prof.replace(new RegExp('&nbsp;', 'g'), ' ').split(' ').slice(1).join(' ')
            }
            else {
                honorifico = ''
                nome = prof
            }

            if (prof.length > 1) {
                console.log({honorifico: honorifico, nome: nome})
                professores.push({honorifico: honorifico, nome: nome})
            }
        })
        $('.entry-content table td:nth-of-type(2)').each(function(index, element){
            var prof = ($(element).text().split("Área")[0]).replace(/\n/g, '')
                                                           .replace(/Profª. /g, '')
                                                           .replace(/Profª./g, '')
                                                           .replace(/Profa. /g, '')
                                                           .replace(/Profa./g, '')
                                                           .replace(/Prof. /g, '')
                                                           .replace(/Prof./g, '')
                                                           .replace(/Nome: /g, '')
                                                           .replace(/\s/g, ' ')
                                                           .trim()
            var honorifico
            var nome
            // if (prof.includes('Lilian')) {
            //     honorifico = 'Dra.'
            //     nome = 'Lilian Berton'
            // }
            if (prof.includes('Dr')) {
                honorifico = prof.replace(new RegExp('&nbsp;', 'g'), ' ').split(' ')[0]
                nome = prof.replace(new RegExp('&nbsp;', 'g'), ' ').split(' ').slice(1).join(' ')
            }
            else {
                honorifico = ''
                nome = prof
            }

            if (prof.length > 1 && !containsObject(nome, professores)) {
                console.log({honorifico: honorifico, nome: nome})
                professores.push({honorifico: honorifico, nome: nome})
            }
        })
        console.log(professores.length)

        resolve(professores)
    })
}

module.exports = {
    getProfs: getProfs
}