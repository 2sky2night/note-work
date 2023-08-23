function A () {
  this.colors = [ 'blue', 'yellow', 'green' ]
}

function B () { }

B.prototype = new A()

const b1 = new B()
const b2 = new B()

b1.colors.push('black')

console.dir(b1.colors);
console.dir(b2.colors);

// 缺点 同类型实例共享一个父类实例