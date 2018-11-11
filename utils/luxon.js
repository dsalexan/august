const {DateTime} = require('luxon')

DateTime.fromSQL = (string) => {
    if(typeof string != 'string' && string.toISOString != undefined) string = string.toISOString()
    return DateTime.fromISO(string, {zone: 'utc'})
}
DateTime.toSQL = (date) => {
    if(date == undefined) date = DateTime.utc()
    return date.toString()
}

module.exports = DateTime