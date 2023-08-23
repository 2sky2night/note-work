//
function A (name) {
  this.name = name
}
function B (name, age) {
  A.call(this, name)
  this.age = age
}

/**
 * 手动为子类创建一个原型对象
 */
function getProto (father, children, publicAttrs = {}) {
  // Object.create会创建一个空对象，对象的隐式原型为传入的对象
  children.prototype = Object.create(father.prototype)
  // 创建构造函数
  children.prototype.constructor = children
  // 给原型绑定公共方法和属性
  Reflect.ownKeys(publicAttrs).forEach(key => {
    children.prototype[ key ] = publicAttrs[ key ]
  })
}

getProto(A, B,{
  getAge(){
    return this.age
  }
})

console.log(new B('Mark', 18))