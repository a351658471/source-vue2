import { compileToFunction } from "./compiler/index.js"
import { initGlobalAPI } from "./globalAPI.js"
import { initMixin } from "./init"
import { initLifeCycle } from "./linfecycle"
import { initStateMixin } from "./state.js"
import { createEle, patch } from "./vdom/patch.js"


export default function Vue(options){
    //初始化
    this._init(options)
}

initMixin(Vue)

initLifeCycle(Vue)

initGlobalAPI(Vue)

initStateMixin(Vue)

//------------diff 测试---------------
// let render1= compileToFunction(`<ul>
// <li key="a">a</li>
// <li key="b">b</li>
// <li key="c">c</li>
// <li key="d">d</li>
// <li key="e">e</li>
// <li key="f">f</li>
// <li key="g">g</li>
// </ul>`)
// let vm1 = new Vue({data:{name:'zf'}})
// let preVnode = render1.call(vm1)
// let el = createEle(preVnode)
// document.body.appendChild(el)

// let render2= compileToFunction(`<ul >

// <li key="a">a</li>
// <li key="f">f</li>
// <li key="h">h</li>
// <li key="i">i</li>
// <li key="j">j</li>
// <li key="b">b</li>
// <li key="g">g</li>
// </ul>`)
// let vm2 = new Vue({data:{name:'zf'}})
// let nextVnode = render2.call(vm2)
// setTimeout(() => {
//     patch(preVnode,nextVnode)
// }, 1000);