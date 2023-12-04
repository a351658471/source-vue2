let oldArrayProto = Array.prototype
let newArrayProto = Object.create(oldArrayProto) //原型继承 防止污染
const METHODS = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'sort'
]




METHODS.forEach(methods => {
    newArrayProto[methods] = function(...args){
        const result = oldArrayProto[methods].call(this, ...args)
        console.log("🚀 ~ file: array.js:19 ~ this:", this)
        let inserted
        switch(methods){
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
            default :
                break;
        }
        let ob = this.__ob__
        if(inserted){
            //如果有新增 则对改新增部分进行观测
            
            ob.observeArray(inserted)
        }
        ob.dep.notify()
        return result
    }
})

export {
    newArrayProto
}