import { compileToFunction } from "./compiler/index"
import { callHook, mountComponent } from "./linfecycle.js"
import { initState } from "./state"
import { mergeOptions } from "./utils.js"

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        vm.$options = mergeOptions(this.constructor.options, options)
        callHook(vm, 'beforeCreate')
        //初始化数据
        initState(vm)
        callHook(vm, 'created')
        if(options.el){
            vm.$mount(options.el)
        }
    }

    Vue.prototype.$mount = function(el){
        const vm = this
        const ops = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if(!ops.render){
            let template
            //传入的options 没有render函数时
            if(!ops.template && el){
                template = el.outerHTML
            }else{
                if(el){
                    template = ops.template
                }
            }

            if(template){
                //取得template值后
                const render = compileToFunction(template)
                ops.render = render
            }
        }
         mountComponent(vm, el)
    }
}

