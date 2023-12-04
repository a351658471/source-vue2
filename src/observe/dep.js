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
        console.log("🚀 ~ file: dep.js:17 ~ Dep ~ notify ~ this.subs:", this.subs)
    }
}
Dep.target = null

let stack = []
export function pushTarget(watcher){
    stack.push(watcher)
    Dep.target = watcher
}
export function popTarget(){
    stack.pop()
    Dep.target = stack[stack.length - 1]
}