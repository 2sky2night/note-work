const person = {
  name: 'Mark',
  info: {
    adress: 'USA',
    tel: '13983877446'
  },
  children: [
    1, 2, 3
  ],
  homes: [
    {
      money: 1000,
      adress: 'CHINA'
    },
    {
      money: 2000,
      adress: 'JPAN'
    }
  ]
}

function myDeepCopy (obj) {
  if (obj.__proto__ === Object.prototype) {
    // 若传入的是一个对象 则使用对象的方式来处理
    const copyObj = {}
    Object.keys(obj).forEach(key => {
      if (typeof obj[ key ] !== 'object' || obj[ key ] === null) {
        // 普通类型的数据直接保存
        copyObj[ key ] = obj[ key ]
      } else {
        // 若非普通数据类型
        // 先不考虑函数
        const resObj = myDeepCopy(obj[ key ])
        copyObj[ key ] = resObj
      }
    })
    return copyObj
  } else if (obj.__proto__ === Array.prototype) {
    // 若传入的是一个数组
    const copyObj = []
    obj.forEach(ele => {
      if (typeof ele !== 'object' || ele === null) {
        // 普通数据
        copyObj.push(ele)
      } else {
        // 非普通数据(根据传入的类型返回什么样的类型)
        const resObj = myDeepCopy(ele)
        copyObj.push(resObj)
      }
    })
    // 返回
    return copyObj
  }
}

function myShallowCopy (obj) {
  return { ...obj }
}

const pcopy = myDeepCopy(person)
console.log(person, pcopy);
// 对象是否深拷贝成功?
console.log(pcopy.info === person.info);
// 数组是否深拷贝成功？
console.log(pcopy.children === person.children);
// 数组若中的元素类型是一个对象是否深拷贝成功
console.log(pcopy.homes[ 0 ] === person.homes[ 0 ]);