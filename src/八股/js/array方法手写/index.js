// forEach every some reduce map filter
// 遍历数组，调用回调
Array.prototype._forEach = function (cb) {
  for (let i = 0; i < this.length; i++) {
    cb(this[i], i, this)
  }
}
// 遍历数组，回调中某一次返回布尔值真结束循环（数组中是否有某个元素满足其条件）
Array.prototype._some = function (cb) {
  let flag = false
  for (let i = 0; i < this.length; i++) {
    const _flag = cb(this[i], i, this)
    if (_flag) {
      flag = true
      break
    }
  }
  return flag
}
// 遍历数组，回调都返回真返回真（数组中是否每个元素都满足了某种条件）
Array.prototype._every = function (cb) {
  let i = 0
  for (; i < this.length; i++) {
    const flag = cb(this[i], i, this)
    if (!flag) {
      break
    }
  }
  return i === this.length
}
// 遍历数组，将满足条件的元素过滤出来成一个新数组
Array.prototype._filter = function (cb) {
  const arr = []
  for (let i = 0; i < this.length; i++) {
    const flag = cb(this[i], i, this)
    if (flag) {
      arr.push(this[i])
    }
  }
  return arr
}
// 遍历数组，计算出一个结果
Array.prototype._reduce = function (cb, sum = 0) {
  for (let i = 0; i < this.length; i++) {
    const res = cb(sum, this[i], i, this)
    sum = res
  }
  return sum
}
// 遍历数组，返回一个新数组
Array.prototype._map = function (cb) {
  const arr = []
  for (let index = 0; index < this.length; index++) {
    const res = cb(this[index], index, this)
    arr.push(res)
  }
  return arr
}
const a = [10,9,8]

console.log(
  a._map(ele => {
    return {
      age:ele
    }
  })
)
