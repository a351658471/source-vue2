import { mergeOptions } from "./utils.js"


export function initGlobalAPI(Vue){
    Vue.options = {}
    Vue.mixin = function(mixin){
        this.options = mergeOptions(this.options, mixin)
        console.log("🚀 ~ file: index.js:38 ~ this.options:", this.options)
    }
}

