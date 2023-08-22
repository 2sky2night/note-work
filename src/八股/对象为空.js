const a = {
  a: '11'
}

const b = {
  // symbol作为对象的key时，不能被枚举
  [ Symbol('asdas') ]: 5
}

const c = {}

Object.defineProperty(c, 'love', {
  // 不可枚举时，也不能被枚举
  enumerable: false,
  get () {
    return 'hello'
  }
})


// for in 
function isEmpty01 (obj) {
  let hasNoAttr = true
  for (let key in obj) {
    hasNoAttr = false
    break;
  }
  return hasNoAttr
}

// keys获取对象的属性
function isEmpty02 (obj) {
  return !Object.keys(obj).length
}

// JSON
function isEmpty03 (obj) {
  if (JSON.stringify(obj) === "{}") {
    return true
  } else {
    return false
  }
}

// ownKeys可以获取到对象自身上的所有属性
function isEmpty04 (obj) {
  return !Reflect.ownKeys(obj).length
}

console.log(isEmpty01(c))
console.log(isEmpty02(c))
console.log(isEmpty03(c))
console.log(isEmpty04(c))
