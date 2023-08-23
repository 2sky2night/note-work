function MyNew (cb, ...args) {
  // 创建新对象
  const obj = {}
  // 让对象的隐式原型指向原型对象
  obj.__proto__ = cb.prototype
  // 绑定this，并调用构造函数
  obj[ cb.name ] = cb
  obj[ cb.name ](...args)
  // 删除构造函数
  delete obj[cb.name]
  // 返回新对象
  return obj
}

function Person (name, age) {
  this.name = name
  this.age = age
}

console.log(MyNew(Person, 'Mark', 18));

