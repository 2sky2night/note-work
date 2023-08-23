// 深浅拷贝主要涉及到基本数据类型和引用数据类型的区别
/**
 * 基本数据类型:number,bigint,boolean,string,null,Symbol,undefined
 * 引用数据类型:object,function,Date,Map,Set,Promise等等
 * 他们最根本的区别就是，基本数据类型的数据都是保存在栈中，引用数据类型保存在堆中，变量通过保存对象在堆中的内存地址来访问属性。
 * 而就是因为变量保存的是对象在堆中的内存地址才会导致浅拷贝产生的问题。若两个变量同时引用相同内存地址的对象，则通过一个变量修改这个对象中的属性，会导致另一个对象访问这个对象时会发现对象的属性发生了变化。
 * 这就是因为两个变量都引用相同的内存地址，没有创建新的内存空间导致的问题，在拷贝引用类型的数据时，应该根据其属性来创建一个新对象，从而开辟一段新的内存空间
 */
const person = {
  name: 'Mark',
  hobby:['working','playFootBall'],
  kids: [
    {
      name: 'Json',
      kids: null,
      hobby: [ 'playGame', 'playFootBall' ]
    },
    {
      name: 'Hash',
      kids: null,
      hobby: [ 'playGame', 'playFootBall' ]
    }
  ],
  [ Symbol('hash') ]: 'eysadnopasndopnDD4'
}

// 浅拷贝
function shallowCopy (obj) {
  if (obj.__proto__ === Array.prototype) {
    // 是数组
    return [ ...obj ]
  } else if (obj.__proto__ === Object.prototype) {
    // 是object
    // return {...obj}
    const newObj = {}
    Reflect.ownKeys(obj).forEach(key => {
      newObj[ key ] = obj[ key ]
    })
    return newObj
  }
  return '待完善'
}

// 深拷贝
function deepCopy (obj) {
  if (obj.__proto__ === Array.prototype) {
    // 是数组
    const newArray = []
    obj.forEach(ele => {
      if (typeof ele !== 'object' || ele === null) {
        // 是普通数据类型
        newArray.push(ele)
      } else {
        // 非普通数据类型
        const resEle = deepCopy(ele)
        newArray.push(resEle)
      }
    })
    return newArray
  } else if (obj.__proto__ === Object.prototype) {
    // 是对象
    const newObj = {}
    Reflect.ownKeys(obj).forEach(key => {
      const value = obj[ key ]
      if (typeof value !== 'object' || value === null) {
        newObj[ key ] = value
      } else {
        // 非普通数据类型
        const resValue = deepCopy(value)
        newObj[ key ] = resValue
      }
    })
    return newObj
  } else if (obj.__proto__ === Function.prototype) {
    // 是函数
    return obj
  } else {
    // 是set、map、date、promise
    return '待完善'
  }
}
