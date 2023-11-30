// 以下为源码的正则 
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


export function parseHTML(html){
    const ELEMENT_TYPE = 1
    const TEXT_TYPE=3
    const stack = []
    let root
    let currentParent

    function createASTElement(tag, attrs){
        return {
            tag,
            type:ELEMENT_TYPE,
            children:[],
            attrs,
            parent:null
        }
    }

    function start(tag, attrs) {
        let node = createASTElement(tag, attrs)
        if(!root) root = node //根节点root为空时 第一个创建的node就是根节点root
        if(currentParent){
            node.parent = currentParent
            currentParent.children.push(node)
        }
        currentParent = node
        stack.push(node)
    }
    function chars(text) {
        text = text.replace(/\s+/g,' ')
        if(!text)return
        currentParent.children.push({
            type:TEXT_TYPE,
            text
        })
    }
    function end(tag) {
        stack.pop()
        currentParent = stack[stack.length-1]
    }

    function advance(n){
        html = html.substring(n)
    }
    function parseStartTag(){
        const start = html.match(startTagOpen)
       
        if(start){
            let match = {
                tag:start[1],
                attrs:[]
            }
            advance(start[0].length)
            let end, attrs
            while(!(end = html.match(startTagClose)) && (attrs = html.match(attribute)) ){
                match.attrs.push({
                    name:attrs[1],
                    value:attrs[3]||attrs[4]||attrs[5]
                })

                advance(attrs[0].length)
            }

            if(end)advance(end[0].length)
            return match
        }
        return false
    }
    while (html) {
        let textEnd = html.indexOf('<')
        if(textEnd === 0){
           let startTagMatch = parseStartTag()
           if( startTagMatch ){
             start(startTagMatch.tag,startTagMatch.attrs)
             continue
            }
            let endTagMatch = html.match(endTag)
            if(endTagMatch){
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }
        }
        if(textEnd > 0){
            let text = html.substring(0,textEnd)
            chars(text)
            if(text) advance(text.length)
        }
       
    }
    return root
   
}