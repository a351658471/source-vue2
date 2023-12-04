import { popTarget, pushTarget } from "./dep.js"

let id = 0
export class Watcher{
    constructor(vm, exptOrFn,option, cb){
        this.id = id++
        if(typeof exptOrFn === 'string'){
            this.getter = function(){
                return vm[exptOrFn]
            }
        }else {
            this.getter = exptOrFn
        }
        this.renderWatcher = option
        this.deps = []
        this.depsId = new Set()
        
        this.cb =cb
        this.lazy = option.lazy //计算属性懒加载标识
        this.dirty = this.lazy //计算属性 脏 标识  true的时候取值才会重新计算
        this.user = option.user// 监听属性 标识
        this.vm = vm
        this.value = this.lazy?undefined:this.get()
        
    }
    evaluate(){
        this.value = this.get()
        this.dirty = false
    }
    get(){
        console.log('get');
        pushTarget(this)
        let value = this.getter.call(this.vm)
        popTarget()
        return value
    }
    depend(){
        this.deps.forEach(dep => {
            dep.depend()
        })
    }
    addDep(dep){
        if(!this.depsId.has(dep.id)){
            this.deps.push(dep)
            this.depsId.add(dep.id)
            dep.addSub(this)
        }
        
    }
    updata(){
        if(this.lazy){
            this.dirty = true
        }else{
            queueWatcher(this)
        }
        
    }
    run(){
        let oldValue = this.value
        let newValue = this.value=this.get()
        if(this.user){
            this.cb.call(this.vm, newValue, oldValue)
        }
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
    callbacks = []
    waiting =false
}
export function nextTick(cb){
    callbacks.push(cb)
    if(!waiting){
        waiting = true
        timerFunc()
    }
}