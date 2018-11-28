module.exports = {
    diff: (d1, d2) => {
        let _d = {}
        for(let k in d1){
            if(d1[k] != d2[k]){
                _d[k] = [d1[k], d2[k]]
            }
        }

        for(let k in d2){
            if(d2[k] != d1[k]){
                if(!Object.keys(_d).includes(k)){
                    _d[k] = [d2[k], d1[k]]
                }
            }
        }

        return _d
    }
}