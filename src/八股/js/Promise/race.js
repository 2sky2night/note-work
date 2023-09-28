/**
 * @param {Promise[]} arr
 */
Promise._race = function (arr) {
  return new Promise((resolve, reject) => {
    arr.some((p) => {
      p.then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })
}
