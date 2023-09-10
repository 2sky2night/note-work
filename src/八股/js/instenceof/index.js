function MyInstanceof(obj, constructor) {
  let flag = false
  if (obj.__proto__ === constructor.prototype) {
    // 若当前对象隐式原型就是构造函数的显示原型时
    flag = true
  } else if (obj.__proto__ !== null) {
    // 若当前对象还有隐式原型时
    flag = MyInstanceof(obj.__proto__, constructor)
  } else {
    // 对象的原型的原型为null
    return false
  }
  return flag
}
