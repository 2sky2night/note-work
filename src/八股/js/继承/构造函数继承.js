function A (name) {
  this.name = name
}
function B (name, age) {
  A.call(this, name)
  this.age = age
}

console.log(new B('张三', 14));
// 缺点，不能拥有基类的原型对象上的公共属性、方法