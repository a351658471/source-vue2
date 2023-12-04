import { Dep } from "./observe/dep"
import { observe } from "./observe/index"
import { Watcher } from "./observe/watcher"

export function initState(vm){
    const opt = vm.$options
    if(opt.data){
        //初始化data
        initData(vm)
    }
    if(opt.computed){
        initComputed(vm)
    }
    if(opt.watch){
        initWatch(vm)
    }
}

function initData(vm){
    let data = vm.$options.data
    data = typeof data === 'function'?data.call(vm):data

    //将data挂在再实例vm._data上
    vm._data = data
    //对data进行数据劫持---vue2中采用的是Object.defineProperty
    observe(data)


    //将vm.data 用vm来代理
    for(let key in data){
        proxy(vm, '_data', key)
    }
}

function proxy(vm, target, key){
    Object.defineProperty(vm, key, {
        get(){
            //访问vm.xxx时 返回 vm._data.xxxx
            return vm[target][key]
        },
        set(newVal){
            //设置值的时候 给 vm._data.xxx 赋值
            vm[target][key] = newVal
        }
    })
}

function initComputed(vm){
    vm._computedWatcher = {}
    const computed = vm.$options.computed 
    for(let key in computed){
        let userDef = computed[key]
        let fn = typeof userDef.get === 'function'?userDef.get : userDef
        vm._computedWatcher[key]= new Watcher(vm, fn, {lazy:true})
        defineComputed(vm, key ,userDef)
    }
}

function defineComputed(target, key, userDef){
    const set = userDef.set || (()=>{})
    Object.defineProperty(target, key, {
        get:createComputedGetter(key),
        set
    })
}

function createComputedGetter(key){
    return function(){
        const watcher = this._computedWatcher[key]
        if(watcher.dirty){
            watcher.evaluate()
        }
        if(Dep.target){
            watcher.depend()
        }
        return watcher.value
       
    }
}

function initWatch(vm){
    const watch = vm.$options.watch
    for(let key in watch){
        const handler = watch[key]
        if(Array.isArray(handler)){
            handler.forEach(item => createWatcher(vm, key, item))
        }else{
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher(vm, key, handler){
    if(typeof handler === 'string') handler = vm[handler]
    vm.$watch(key, handler)
}