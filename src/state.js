import { observe } from "./observe/index"

export function initState(vm){
    const opt = vm.$options
    if(opt.data){
        //初始化data
        initData(vm)
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