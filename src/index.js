import { initGlobalAPI } from "./globalAPI.js"
import { initMixin } from "./init"
import { initLifeCycle } from "./linfecycle"
import { nextTick } from "./observe/watcher.js"

export default function Vue(options){
    //初始化
    this._init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)

initLifeCycle(Vue)

initGlobalAPI(Vue)