/**
 * Promise.race
 * @param {Promise[]} array
 */
Promise._race = function (array) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      array[i].then(() => resolve()).catch(() => reject())
    }
  })
}

const arr = [1, 2, 3]

Promise._race(
  arr.map((ele) => {
    return new Promise((r) => {
      setTimeout(() => {
        console.log(ele);
        r()
      }, ele * 1000)
    })
  })
).then(() => {
  console.log('ok')
})
