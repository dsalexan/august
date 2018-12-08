const {DateTime} = require('luxon')

DateTime.fromSQL = (string) => {
    if(typeof string != 'string' && string.toISOString != undefined) string = string.toISOString()
    return DateTime.fromISO(string, {zone: 'utc'})
}
DateTime.toSQL = (date, format) => {
    if(date == undefined) date = DateTime.utc()
    else if(typeof date == 'string') date = DateTime.fromFormat(date, format, { locale: 'utc' })
    
    return date.toString()
}

DateTime.toZoneObject = (date, zone) => {
    if(date == undefined) date = DateTime.utc()
    else if(date.constructor.name == 'Object') date = DateTime.fromObject(date)

    date.setZone(zone)

    return {
        hour: date.hour,
        minute: date.minute,
        second: date.second
    }
}

DateTime.toLocalObject = (date) => {
    return DateTime.toZoneObject(date, 'local')
}

module.exports = DateTime