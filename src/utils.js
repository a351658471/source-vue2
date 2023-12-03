export function mergeOptions(parent, child){
    const options = {}
    for(let key in parent){
        mergeField(key)
    }
    for(let key in child){
        mergeField(key)
    }

    function mergeField(key){
        if(starts[key]){
            options[key] = starts[key](parent[key], child[key])
        }else{
            options[key] = child[key] || parent[key]
        }
    }
    return options
}

const starts = {}
const LIFECYCLE = [
    'beforeCreate',
    'created'
]
LIFECYCLE.forEach(item => {
    starts[item] = function(p, c){
        if(c){
            if(p){
                return p.concat(c)
            }else{
                return [c]
            }
        }else{
            if(p){
                return p
            }
        }
    }
})
