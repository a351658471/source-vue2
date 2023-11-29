// 以下为源码的正则 
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


function parseHTML(html){
    function parseStartTag(){
        const satrt = html.match(startTagOpen)
        console.log("🚀 ~ file: index.js:14 ~ parseStartTag ~ satrt:", satrt)
    }
    while (html) {
        let textEnd = html.indexOf('<')
        if(textEnd === 0){
            parseStartTag(html)
        }
        return
    }
   
}

export function compileToFunction(html){
console.log("🚀 ~ file: index.js:2 ~ compileToFunction ~ html:", html)
    const ast = parseHTML(html)
}