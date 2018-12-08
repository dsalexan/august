const DateTime = require('../../../utils/luxon')

class Schedule{
    constructor(job_interval=2){
        this.spots = []
        this.jobs = {}
        
        this.job_interval = job_interval // in minutes

        this.create()
    }

    create(){        
        for(let _h = 0; _h < 24; _h++){
            for(let _m = 0; _m < 60; _m+=this.job_interval){
                this.spots.push(DateTime.fromObject({hour: _h, minute: _m}))
            }
        }

        for(let i = 0; i < this.spots.length; i++){
            this.jobs[i] = []
        }
    }

    spot(start, end){
        if(start == undefined){
            start = DateTime.fromObject({
                hour: 0,
                minute: 0
            })
        }

        if(end == undefined){
            end = DateTime.fromObject({
                hour: 23,
                minute: 59
            })
        }

        if(start.constructor.name == 'Object'){
            start = DateTime.fromObject(start)
        }

        if(end.constructor.name == 'Object'){
            end = DateTime.fromObject(end)
        }

        // get all time between start and end
        let spots = this.spots.map((s, index) => {
            return {
                spot: s,
                jobs: this.jobs[index],
                index
            }
        }).filter(s => start <= s.spot && s.spot <= end)

        // priorize by job count
        spots.sort((a, b) => a.jobs.length - b.jobs.length)

        // choose first
        return spots[0] && spots[0].spot
    }

    add(spot, job){
        if(spot.constructor.name == 'Object'){
            spot = DateTime.fromObject(spot)
        }

        let i
        for(i = 0; i<this.spots.length; i++){
            if(+(this.spots[i]) === +(spot)) break
        }

        this.jobs[i].push(job)
    }
}

module.exports = Schedule