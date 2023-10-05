/**
 * 节流
 * @param {Function} cb
 * @param {number} delay
 * @param {any} context
 * @returns
 */
function throttle(cb, delay = 500, context = this) {
  let time = null
  return function (...args) {
    if (time !== null) return
    time = setTimeout(() => {
      time = null
    }, delay)
    cb.apply(context, args)
  }
}

