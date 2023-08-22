
// 组合继承
function A () {
  this.a_name = '123'
}

function B () {
  // 获取A类的属性
  A.call(this)
  this.b_name = '123'
}

A.prototype.sayName = function () {
  console.log('hello', this.a_name);
}

// 获取A类的原型，获取a在原型上的公共属性和方法
B.prototype.__proto__ = A.prototype

// const b = new B()

// console.log(b);
