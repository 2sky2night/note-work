// call fn.call(obj,arg1,args2....)
function myCall (obj, ...args) {
  obj[ this.name ] = this
  obj[ this.name ](...args)
  delete obj[ this.name ]
}
// apply  fn.apply(obj,[arg1,args2....])
function myApply (obj, args) {
  // args是一个数组
  obj[ this.name ] = this
  obj[ this.name ](...args)
  delete obj[ this.name ]
}
// bind fn.bind(obj)
function myBind (obj) {
  // 通过闭包，获取到对象本身和函数上下文
  // 这里需要通过content来保存myBind调用时的那个函数
  const content = this
  return function (...args) {
    // 回调执行时，通过闭包获取content，也就调用mybind的那个函数
    // 将此函数挂载到对象自身上，并调用函数，此时的this始终为最后调用函数的对象
    obj[ content.name ] = content
    obj[ content.name ](...args)
    delete obj[ content.name ]
  }
}

Function.prototype.myCall = myCall
Function.prototype.myApply = myApply
Function.prototype.myBind = myBind