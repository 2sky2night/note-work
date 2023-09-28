console.log('Work Load!')

fun(2000)
this.postMessage('计算完成~')
this.close()
function fun(time) {
  const now = Date.now()
  while (Date.now() - now <= time) {}
}
