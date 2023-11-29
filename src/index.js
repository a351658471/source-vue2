import { initMixin } from "./init"

export default function Vue(options){
    //初始化
    this._init(options)
}

initMixin(Vue)