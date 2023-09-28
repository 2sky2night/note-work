console.log('worker:load ok!')
console.log(this);
this.addEventListener('message', (data) => {
  console.log('接受到主线程消息:' + data.data)
})

this.postMessage('子线程消息~~')
