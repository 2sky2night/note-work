面筋们：
1.https://juejin.cn/post/7064740689178787871
## JS
### bind、call、apply
  这三个方法都是修改函数执行时的this指向，call、apply都是立即调用函数，而bind是创建一个this指向被修改了的函数。call、apply的唯一区别就是传参方式不同而已。
  
 #### call
  在调用myCall时，this其实就是调用函数的那个对象，也就是目标函数。通过this指向始终都是最后调用该方法的那个对象的特性，给对象添加一个方法，最终调用该方法时this指向就是这个对象了。注意调用时不要把参数忘记了，用剩余参数来接受参数列表时获取到的是一个数组，在调用时通过展开运算符将其展开即可依次传入参数了，在调用函数后，通过delete删除改方法。

```js
// call fn.call(obj,arg1,args2....)
function myCall (obj, ...args) {
  obj[ this.name ] = this
  obj[ this.name ](...args)
  delete obj[ this.name ]
}
```

#### apply
  apply和call原理差不多，只不过在调用apply时传入的参数方式不同而已，第一个参数都是目标函数this指向的目标对象，apply的第二个参数是一个数组，数组中就是调用函数的参数了。

```js
// apply  fn.apply(obj,[arg1,args2....])
function myApply (obj, args) {
  // args是一个数组
  obj[ this.name ] = this
  obj[ this.name ](...args)
  delete obj[ this.name ]
}
```

#### bind
  bind是返回一个this指向被修改了的函数，需要用到闭包来延长目标函数以及目标对象的生命周期。每次调用通过bind返回的回调函数时，都会临时去给对象添加方法并调用，最后删除这样的过程。
```js
// bind fn.bind(obj)
function myBind (obj) {
  // 回调函数调用时可以通过闭包，获取到对象本身和函数上下文
  // 这里需要通过content来保存myBind调用时的那个函数
  const content = this
  return function (...args) {
    // 回调执行时，通过闭包获取content，也就调用mybind的那个函数
    // 将此函数挂载到对象自身上，并调用函数，此时的this始终为最后调用函数的对象
    obj[ content.name ] = content
    obj[ content.name ](...args)
    delete obj[ content.name ]
  }
}

```

### cookie、sessionStorage、localStorage
  区别:https://blog.csdn.net/qq_35585701/article/details/81393361?ydreferer=aHR0cHM6Ly9saW5rLmp1ZWppbi5jbi8%3D
#### cookie
  cookie是存储在浏览器中**4kb**的字符串，每个网页（域）使用共享cookie，cookie会在网络请求时自动携带在请求头部中，供服务端解析识别信息，可以用来获取请求用户的身份，保存一写数据等功能。
  document.cookie是一个可读可写的属性，读取时会把当前网页（域）中的所有cookie获取出来，写入cookie时，只能添加一个有效的cookie，通常是一个键值对的字符串，并且也可以配置过期时间和域等设置。
  cookie不方便的就是对于单项cookie的读取，因为每次读取都是整个cookie数据，每个cookie数据通过分号相隔，需要通过解析才能读取。
  例如通过以下方式解析cookie数据:
  ```ts
   document.cookie.split('; ').reduce((pre,ele)=>{
    const [key,value]=ele.split('=');
    return {...pre,[key]:value}
    },{})
  ```
  cookie相关：https://juejin.cn/post/6914109129267740686#heading-0

#### sessionStorage
  会话存储是存储在浏览中**5mb**的数据，每个网页（域）独享一个会话存储，这些数据都是以键值对的方式存在，这些数据会在关闭标签页时同时被销毁。通过相关api可以读写删除数据。
  ```ts
  sessionStorage.getItem('key')
  sessionStorage.setItem('key','value')
  sessionStorage.remove('key')
  sessionStorage.clear()
  ```

#### localStorage
  本地存储和会话存储基本差不多，只不过他不会在关闭网页时销毁数据，只能通过用户删除或js才能删除数据。

### 深浅拷贝
  深浅拷贝主要涉及到基本数据类型和引用数据类型的区别
  基本数据类型:number,bigint,boolean,string,null,Symbol,undefined
  引用数据类型:object,function,Date,Map,Set,Promise等等
  他们最根本的区别就是，基本数据类型的数据都是保存在栈中，引用数据类型保存在堆中，变量通过保存对象在堆中的内存地址来访问属性。
  而就是因为变量保存的是对象在堆中的内存地址才会导致浅拷贝产生的问题。若两个变量同时引用相同内存地址的对象，则通过一个变量修改这个对象中的属性，会导致另一个对象访问这个对象时会发现对象的属性发生了变化。
  这就是因为两个变量都引用相同的内存地址，没有创建新的内存空间导致的问题，在拷贝引用类型的数据时，应该根据其属性来创建一个新对象，从而开辟一段新的内存空间。
 ```js
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

```

### 原型
  原型包括了原型链，构造函数，原型对象