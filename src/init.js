import { compileToFunction } from "./compiler/index"
import { initState } from "./state"

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        vm.$options = options
        //初始化数据
        initState(vm)

        if(options.el){
            vm.$mount(options.el)
        }
    }

    Vue.prototype.$mount = function(el){
        console.log("🚀 ~ file: init.js:17 ~ initMixin ~ el:", el)
        const vm = this
        const ops = vm.$options
        el = document.querySelector(el)
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
                const render = compileToFunction
                (template)
                ops.render = render
            }
        }
        return ops.render
    }
}
