let id = 0
export class Dep{
    constructor(){
        this.id = id++
        this.subs = []
    }
    depend(){
        Dep.target.addDep(this)
    }
    addSub(sub){
        this.subs.push(sub)
    }
    notify(){
        this.subs.forEach(watcher => {
            watcher.updata()
        })
    }
}
Dep.target = null