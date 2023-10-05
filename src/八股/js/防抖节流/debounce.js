function debounce(cb, delay = 500, context = this) {
  let timer = null
  return function (...args) {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      cb.apply(context, args)
      timer = null
    }, delay)
  }
}