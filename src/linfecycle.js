import { Watcher } from "./observe/watcher.js";
import { createElementVNode, createTextVNode } from "./vdom/index";

function patchProps(el, props){
    for(let key  in props){
        if(key === 'style'){
            for(let styleName in props.style){
                el.style[styleName] = props.style[styleName]
            }
        }else{
            el.setAttribute(key, props[key])
        }
    }
}
function createEle(vnode){
    let {tag, data, children, text} = vnode
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, data)
        children.forEach(child => {
           vnode.el.appendChild(createEle(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function patch(oldVNode, vnode){
    const isRealElement = oldVNode.nodeType
    if(isRealElement){
        //有值说明是首次渲染 
        const parentEl = oldVNode.parentNode
        //创建真实dom
        let newElm = createEle(vnode)
        parentEl.insertBefore(newElm, oldVNode)
        parentEl.removeChild(oldVNode)
        return newElm
    }else{
        //是虚拟dom则进行diff算法
    }

}

export function initLifeCycle(Vue){
    Vue.prototype._render = function(){
        return this.$options.render.call(this)
       
    }
    Vue.prototype._updata = function(vnode){
        const vm = this
        vm.$el = patch(vm.$el, vnode)
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