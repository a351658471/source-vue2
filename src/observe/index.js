import { newArrayProto } from "./array"
import { Dep } from "./dep.js"

export function observe(data){
    if(typeof data !='object' || data == null) return
    return new Observer(data)
}

class Observer{
    constructor(data){
        this.dep = new Dep()
        Object.defineProperty(data, '__ob__',{
            value:this,
            enumerable:false //设置为不可枚举  防止observe遍历到改属性 从而陷入死循环
        })
        if(Array.isArray(data)){
            //数组 则重写其原型对象的方法
            data.__proto__ = newArrayProto
            this.observeArray(data)
        }else{
            //普通对象则遍历其属性 使用object.defineproperty
            this.walk(data)
        }
    }
    walk(data){
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
    observeArray(data){
        data.forEach(item => observe(item))
    }
}

function dependArray(value){
    for(let i=0; i<value.length; i++){
        let current = value[i]
        current.__ob__ &&current.__ob__.dep.depend()
        if(Array.isArray(current)){
            dependArray(current)
        }
    }
}

export function defineReactive(target, key, value){
    let childOb = observe(value)
    let dep = new Dep()
    Object.defineProperty(target, key, {
        get(){
            console.log('获取值 '+key+':',value);
            if(Dep.target){
                dep.depend()
                if(childOb){
                    childOb.dep.depend()
                    if(Array.isArray(value)){
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newVal){
            console.log('设置值 '+key+':',newVal);
            if(value === newVal)return
            observe(newVal)
            value = newVal
            console.log('==============');
            dep.notify()
        }
    })
}