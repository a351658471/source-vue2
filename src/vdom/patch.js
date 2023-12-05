import { isSameVnode } from "./index"

function patchProps(el,oldProps = {}, props = {}){
    let oldStyle = oldProps.style || {}
    let newStyle = props.style || {}
    for(let key in oldStyle){
        if(!newStyle[key]){
            oldStyle[key] = ''
        }
    }
    for(let key in oldProps){
        if(!props[key]){
            el.removeAttribute(key)
        }
    }
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
export function createEle(vnode){
    let {tag, data, children, text} = vnode
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag)
        patchProps(vnode.el,{}, data)
        children.forEach(child => {
           vnode.el.appendChild(createEle(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

export function patch(oldVNode, vnode){
    console.log("🚀 ~ file: patch.js:41 ~ patch ~ oldVNode, vnode:", oldVNode, vnode)
    
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
        return patchVnode(oldVNode, vnode)
        

}

}


function patchVnode(oldVNode, vnode){
    if(!isSameVnode(oldVNode, vnode)){
        // 如果tag && key不相等  则直接创建新的dom替换
        let el = createEle(vnode)
        oldVNode.el.parentNode.replaceChild(el, oldVNode.el)
        return el
    }

    let el = vnode.el = oldVNode.el
    if(!oldVNode.tag){
        //文本
        if(oldVNode.text !== vnode.text){
            el.textContent = vnode.text
        }
        console.log('wenben');
        return el
    }
    patchProps(oldVNode.el, oldVNode.data, vnode.data)

    //比较儿子节点
    let oldChildren = oldVNode.children || []
    let newChildren = vnode.children || []
    
    if(oldChildren.length >0 && newChildren.length > 0){
        //都有子节点的情况
        updataChildren(el,oldChildren,newChildren)
    }else if(newChildren.length > 0){
        //新节点有子节点 旧的没有 则创建新的替换
        mountChildren(el, newChildren)
    }else if(oldChildren.length > 0){
        //旧节有字节点 新的没有子节点  则删除旧节点的所有子节点
        oldVNode.innerHTML = ''
    }
    return el
}

function mountChildren(el, newChildren){
    newChildren.forEach(child => el.appendChild(createEle(child)))
}

function updataChildren(el, oldChildren, newChildren){
    //双指针
    let oldStartIndex = 0

    let newStartIndex = 0

    let oldEndIndex = oldChildren.length -1

    let newEndIndex = newChildren.length - 1


    let oldStartVnode = oldChildren[oldStartIndex]
    let newStartVnode = newChildren[newStartIndex]
    let oldEndVnode = oldChildren[oldEndIndex]
    let newEndVnode = newChildren[newEndIndex]

    function makeIndexByKey(children){
        let map = {}
        children.forEach((child, index)=>{
            map[child.key] = index
        })
        return map
    }
    let map = makeIndexByKey(oldChildren)
    while(oldStartIndex<=oldEndIndex && newStartIndex<=newEndIndex){
        if(!oldStartVnode){
            oldStartVnode = oldChildren[++oldStartIndex]
        }else if(!oldEndVnode){
            oldEndVnode = oldChildren[--oldEndIndex]
        }else if(isSameVnode(oldStartVnode,newStartVnode)){
            //比较双方开始节点
            patchVnode(oldStartVnode,newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]

        }else if(isSameVnode(oldEndVnode, newEndVnode)){
            //比较新老结束节点
            patchVnode(oldEndVnode,newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else if(isSameVnode(oldEndVnode, newStartVnode)){
            //交叉对比
            patch(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        }
        else if(isSameVnode(oldStartVnode, newEndVnode)){
            //交叉对比
            patch(oldStartVnode, newEndVnode)
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartIndex = oldChildren[++oldStartIndex] 
            newEndIndex = newChildren[--newEndIndex]
        }else{
            let moveIndex = map[newStartVnode.key]
            if(moveIndex !== undefined){
                
                // 乱序对比
                let moveVnode = oldChildren[moveIndex]
                el.insertBefore(moveVnode.el, oldStartVnode.el)
                oldChildren[moveIndex] = undefined
                patchVnode(moveVnode, newStartVnode)
            }else{
                el.insertBefore(createEle(newStartVnode), oldStartVnode.el)
                
            }
            newStartVnode = newChildren[++newStartIndex]
        }
        
    }

    if(newStartIndex <= newEndIndex){
        for(let i = newStartIndex; i<=newEndIndex; i++){
            let child = createEle(newChildren[i])
            let anchor = newChildren[newEndIndex + 1]?newChildren[newEndIndex + 1]:null
            el.insertBefore(child, anchor)//anchor = null 会被认为是appendchild
        }
    }
    if(oldStartIndex <= oldEndIndex){
        for(let i = oldStartIndex; i<=oldEndIndex; i++){
            if(oldChildren[i]){
                let child = oldChildren[i].el
                el.removeChild(child)
                
            }
            
        }
    }
}