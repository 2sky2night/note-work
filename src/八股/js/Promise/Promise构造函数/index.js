class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  /**
   * Promise
   * @param {import('./index').Executor} executor
   */
  constructor(executor) {
    // 失败的初始值
    this.reason = null
    // 成功的初始值
    this.value = null
    // promise的状态
    this.status = MyPromise.PENDING
    // 履行的回调们
    this.onFulfuilledCallbacks = []
    // 拒绝的回调们
    this.onRejectedCallbacks = []
    try {
      // 执行传入的回调
      // 并将设置实例状态的方法传入进回调
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 若回调内部出错，则设置状态为拒绝
      this.reject(error)
    }
  }
  /**
   * 若Promise实例的状态为pending则
   * 将Promise实例的状态设置为成功
   * 并保存履行的值
   * 执行履行的回调们
   * @param {any} value
   * @example promise.resolve(1)
   */
  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.value = value
      this.status = MyPromise.FULFILLED
      this.onFulfuilledCallbacks.forEach((cb) => {
        cb()
      })
    }
  }
  /**
   * 若Promise实例状态为pending则
   * 将Promise实例状态设置为rejected
   * 并获取拒绝的原因
   * 执行拒绝的回调们
   * @param {any} reason
   */
  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.reason = reason
      this.status = MyPromise.REJECTED
      this.onRejectedCallbacks.forEach((cb) => {
        cb()
      })
    }
  }
  /**
   * promise.then
   * 1.同步处理
   *  当调用then时，Promise已经进入结果阶段了，可以根据状态直接执行相应回调。
   * 2.异步处理
   * 3.链式调用，返回Promise
   *  3.1 回调返回非Promise
   *  3.2 回调返回Promise
   *    3.2.1 处理一般情况
   *    3.2.2 处理重复引用
   * @param {import('./index').OnFulfilled} onFulfilled
   * @param {import('./index').OnRejected} onRejected
   */
  then(onFulfilled, onRejected) {
    let _onFulfilled = onFulfilled
    let _onRejected = onRejected
    // 参数检查，若不是函数，则将onFulfilled、onRejected设置为默认函数
    // 默认函数都是返回一个value或reason
    if (typeof _onFulfilled !== 'function') {
      _onFulfilled = function (value) {
        return value
      }
    }
    if (typeof _onRejected !== 'function') {
      _onRejected = function (reason) {
        throw reason
      }
    }
    // 链式调用
    const p = new MyPromise((resolve, reject) => {
      // 为什么要将调用等其他逻辑放在里面新promise的executor里，
      // 就是为了保证在调用onFulfilled或onRejected后
      // 可以根据异常来调用resolve，reject并设置新Promise的状态和结果
      if (this.status === MyPromise.PENDING) {
        // 异步
        // 将onfulfilled函数保存在履行的回调中
        this.onFulfuilledCallbacks.push(() => {
          // 该函数是在promise.resolve时才会调用
          this.runAsyncCb(() => {
            try {
              this.resolvePromise(this.value, p, _onFulfilled, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        // 将onrejected函数保存在拒绝的回调中
        this.onRejectedCallbacks.push(() => {
          // 该函数是在promise.reject时才会调用
          this.runAsyncCb(() => {
            try {
              this.resolvePromise(this.reason, p, _onRejected, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      } else if (this.status === MyPromise.FULFILLED) {
        // 同步-履行
        this.runAsyncCb(() => {
          // 异步任务，为了能读取p
          this.resolvePromise(this.value, p, _onFulfilled, resolve, reject)
          // try {
          //   // 调用并获取返回结果
          //   const result = onFulfilled(this.value)
          //   if (result instanceof MyPromise) {
          //     if (result === p) {
          //       // 重复引用
          //       throw new TypeError('Promise重复引用!')
          //     }
          //     // 若返回的是Promise实例本身，则通过then方法设置成功和失败的回调
          //     // 去设置p的状态和结果
          //     result.then(
          //       (v) => resolve(v),
          //       (e) => reject(e)
          //     )
          //   } else {
          //     // 将Promise的状态设置为fulfilled，并设置value
          //     // 保证then可以获取到上一个then的结果
          //     resolve(result)
          //   }
          // } catch (error) {
          //   reject(error)
          // }
        })
      } else if (this.status === MyPromise.REJECTED) {
        // 同步-失败
        this.runAsyncCb(() => {
          // 异步任务，为了读取p
          this.resolvePromise(this.reason, p, onRejected, resolve, reject)
          // try {
          //   const reason = onRejected(this.reason)
          //   if (reason instanceof MyPromise) {
          //     //返回的是Promise对象
          //     if (reason === p) {
          //       // 返回的promise对象就是then的返回值，重复引用
          //       throw new TypeError('Promise重复引用!')
          //     }
          //     // 返回的是Promise对象，通过返回的Promise对象来设置p的状态和结果
          //     // 通过then方法监听此promise何时状态凝固，当凝固时就会执行回调
          //     // 并设置p的状态和结果
          //     reason.then(
          //       (r) => resolve(r),
          //       (e) => reject(e)
          //     )
          //   } else {
          //     // 返回非Promise对象
          //     // 只要本次onRejected函数无异常就设置p为成功
          //     resolve(reason)
          //   }
          // } catch (error) {
          //   // onRejected函数异常设置p失败
          //   reject(error)
          // }
        })
      }
    })
    return p
  }
  /**
   * 抽离Promise.then中的逻辑
   * @param {*} value 履行或拒绝的结果
   * @param {*} p 即将返回的Promise实例
   * @param {*} cb 要执行的onFulfilled或onRejected回调
   * @param {*} resolve 履行
   * @param {*} reject 拒绝
   */
  resolvePromise(value, p, cb, resolve, reject) {
    try {
      const result = cb(value)
      if (result instanceof MyPromise) {
        // 返回的Promise
        if (result === p) {
          // 返回的Promise为then返回值的Promise
          throw new TypeError('Promise重复引用!')
        }
        // 监听返回的Promise值是什么状态从而设置p的状态和结果
        result.then(
          (v) => resolve(v),
          (e) => reject(e)
        )
      } else {
        // 返回非Promise
        resolve(value)
      }
    } catch (error) {
      // 出错，设置为fulfilled
      reject(error)
    }
  }
  /**
   * 创建微任务
   * @param {*} cb
   */
  runAsyncCb(cb) {
    queueMicrotask(cb)
  }
}

new MyPromise((r) => {
  setTimeout(() => {
    r(100)
  }, 100)
}).then(r => {
  console.log(r);
})