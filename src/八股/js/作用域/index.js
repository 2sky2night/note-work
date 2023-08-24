// 全局作用域，所有作用域都能访问
const num = 5
function fun () {
  // 函数作用域，在函数执行时会创建
  const b = '123'
}
{
  // 块级作用域中的变量
  let greeting = 'Hello World!';
  var lang = 'English';
  console.log(greeting); // Prints 'Hello World!'
}
// 报错：Uncaught ReferenceError: b is not defined 因为b是只能在fun函数执行时在fun函数内部才能访问到
console.log(b);
// 变量 'English' 因为var声明的变量是全局变量
console.log(lang);
// 报错：Uncaught ReferenceError: greeting is not defined
console.log(greeting);