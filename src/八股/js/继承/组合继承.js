function A (name) {
  this.name = name
}
function B (name, age) {
  A.call(this, name)
  this.age = age
}

B.prototype = new A()
B.prototype.constructor = B
// 缺点需要调用两次A，基本实现继承