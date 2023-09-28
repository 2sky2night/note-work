/**
 * @param {Promise[]} arr
 */
Promise._all = function (arr) {
  return new Promise((resolve, reject) => {
    const list = []
    let count = 0
    arr.forEach((p, index) => {
      p.then(
        (value) => {
          count++
          list.push({ index, value })
          if (count === arr.length) {
            resolve(
              list
                .sort((a, b) => a.index - b.index)
                .map((data) => data.value)
            )
          }
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })
}
