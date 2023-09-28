/**
 * Promise.all
 * @param {Promise[]} array
 * @returns {Promise}
 */
Promise._all = function (array) {
  return new Promise((resolve, reject) => {
    // 结束的个数
    let downCount = 0
    // 遍历每一个Promise对象，捕获他们的失败和成功
    for (let i = 0; i < array.length; i++) {
      array[i]
        .then(() => {
          // 每次成功都让结束的个数+1
          downCount++
          if (downCount === array.length) {
            // 若结束的个数等于数组长度，就凝固promise
            resolve()
          }
        })
        .catch(() => {
          // 只要有一个失败了，整个all都失败
          reject()
        })
    }
  })
}

const arr = [1, 2, 3]

Promise._all(
  arr.map(async (ele, index) => {
    return new Promise((r) => {
      setTimeout(() => {
        console.log(ele)
        r()
      }, ele * 1000)
    })
  })
).then(() => {
  console.log('完成')
})
