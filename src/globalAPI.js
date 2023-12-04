import { mergeOptions } from "./utils.js"


export function initGlobalAPI(Vue){
    Vue.options = {}
    Vue.mixin = function(mixin){
        this.options = mergeOptions(this.options, mixin)
    }
}

