/**
 * @param {Array<Promise<any>>} arr
 * @returns
 */
Promise._allSettled = function (arr) {
  return new Promise((resolve) => {
    const list = []
    let count = 0
    arr.forEach((p, index) => {
      p.then(
        (value) => {
          count++
          // 保存结果
          list.push({ result: value, index, status: 'fulfilled' })
          if (count === arr.length) {
            // 若全部都完成了
            resolve(
              list
                .sort((a, b) => a.index - b.index)
                // 保证顺序和数组顺序一致，不能因为谁先结束谁就在前
                .map((data) => ({ result: data.result, status: data.status }))
            )
          }
        },
        (error) => {
          count++
          // 保存结果
          list.push({ result: error, index, status: 'rejected' })
          if (count === arr.length) {
            // 若全部都完成了
            resolve(
              list
                .sort((a, b) => a.index - b.index)
                .map((data) => ({ result: data.result, status: data.status }))
            )
          }
        }
      )
    })
  })
}
