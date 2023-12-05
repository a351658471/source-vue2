import { Watcher } from "./observe/watcher.js";
import { createElementVNode, createTextVNode } from "./vdom/index";
import { patch } from "./vdom/patch.js";

export function initLifeCycle(Vue){
    Vue.prototype._render = function(){
        return this.$options.render.call(this)
       
    }
    Vue.prototype._updata = function(vnode){
        const vm = this
        const preVnode = vm._vnode 
        vm._vnode = vnode //把组件第一次产生的虚拟节点保存到_vnode上
        if(preVnode){
            //有值说明之前渲染过
            vm.$el = patch(preVnode, vnode)
        }else{
            vm.$el = patch(vm.$el, vnode)
        }
        
    }
    Vue.prototype._c = function(){
        return createElementVNode(this, ...arguments)
    }

    Vue.prototype._s = function(value){
        if(typeof value !== 'object')return value
        return JSON.stringify(value)
    }
    Vue.prototype._v =function(){
        return createTextVNode(this, ...arguments)
    }
}

export function mountComponent(vm, el){
    
    const updataComponent=()=>{
        vm._updata(vm._render())
    }
    const watcher = new Watcher(vm, updataComponent, true)
}


export function callHook(vm, hook){
    let handlers = vm.$options[hook]
    if(handlers){
        handlers.forEach(handler => handler.call(vm))
    }
}