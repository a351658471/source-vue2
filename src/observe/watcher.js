import { Dep } from "./dep.js"

let id = 0
export class Watcher{
    constructor(vm, updataComponent,option){
        this.id = id++
        this.getter = updataComponent
        this.renderWatcher = option
        this.deps = []
        this.depsId = new Set()
        this.get()
    }
    get(){
        console.log('get');
        Dep.target = this
        this.getter()
        Dep.target = null
    }
    addDep(dep){
        if(!this.depsId.has(dep.id)){
            this.deps.push(dep)
            this.depsId.add(dep.id)
            dep.addSub(this)
        }
    }
    updata(){
        queueWatcher(this)
    }
    run(){
        this.get()
    }
}

let queue = []
let padding =false
let has = {}
function flushSchedulerQueue(){
    queue.forEach(watcher => {
        watcher.run()
    })
    queue = []
    padding = false
    has = {}
}
function queueWatcher(watcher){
    let id = watcher.id
    if(!has[id]){
        has[id] = true
        queue.push(watcher)
        if(!padding){
            padding = true
            nextTick(flushSchedulerQueue);
        }
    }
}

let callbacks = []
let waiting = false
let timerFunc
if(Promise){
    timerFunc =()=>Promise.resolve().then(flushCallbacks)
}else if(MutationObserver){
    let observer = new MutationObserver(flushCallbacks)
    let textNode =document.createTextNode(1)
    observer.observe(textNode,{
        characterData:true
    })
    timerFunc = ()=>textNode.textContent = 2
}else if(setImmediate){
    timerFunc = ()=>setImmediate(flushCallbacks)
}else{
    timerFunc = ()=>setTimeout(flushCallbacks, 0)
}
function flushCallbacks(){
    callbacks.forEach(cb => cb())
}
export function nextTick(cb){
    callbacks.push(cb)
    if(!waiting){
        waiting = true
        timerFunc()
    }
}