import { parseHTML } from "./parse.js"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genProps(attrs){
    let str = ''
    attrs.forEach(item => {
        if(item.name === 'style'){
            let obj = {}
            item.value.split(';').forEach(val => {
              let [key ,value] = val.split(':')
              obj[key] = value
            })
            item.value = obj
        }
        str+=`${item.name}:${JSON.stringify(item.value)},`
    })
    return str.slice(0,-1)
}
function gen(node){
    if(node.type === 1){
        return codeGen(node)
    }else {
        //文本
        let text = node.text
        let token = []
        let match
        let lastIndex = 0
        defaultTagRE.lastIndex = 0
        while(match = defaultTagRE.exec(text)){
            let index = match.index
            if(lastIndex < index){
                //lastIndex < index 说明 在 {{xxx}}前的普通字符串 例如 aaa{{xxx}} 所以截取aaa先放入token中
                token.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            //将{{xxx}} 转为 _s(xxx) 放入token中
            token.push(`_s(${match[1].trim()})`)
            lastIndex = match.index + match[0].length
        }
        if(lastIndex < text.length){
            //lastIndex < text.length 说明 在{{xxx}}后还存在普通字符 例如{{xxx}}aaa
            token.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${token.join('+')})`
    }
}
function genChildren(ast){
   return ast.children.map(item => gen(item)).join(',')
}
function codeGen(ast){
    let children = genChildren(ast)
    let code = `_c('${ast.tag}',${ast.attrs.length? genProps(ast.attrs):'null'}, ${ast.children.length? children:'null'})`
    console.log("🚀 ~ file: index.js:53 ~ codeGen ~ code:", code)
    return code
    
}
    

export function compileToFunction(html){
    const ast = parseHTML(html)

    codeGen(ast)
}