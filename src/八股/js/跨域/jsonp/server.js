// 提供api
const server = require('http').createServer()
const fs = require('fs')
server.on('request', (req, res) => {
  if (req.url === '/api') {
    // api
    res.setHeader('Content-type', 'application/json')
    res.end(JSON.stringify({
      msg: 'ok',
      code: 200,
      data: [
        {
          name: 'Mark',
          age: 18
        }
      ]
    }))
  } else if (req.url === '/1.js') {
    // 提供脚本文件实现jsonp
    const scriptString = fs.readFileSync('./1.js', 'utf-8')
    res.setHeader('Content-type', 'text/javascript')
    res.end(scriptString)
  } else if (req.url === '/api-jsonp') {
    // 模拟真实数据
    const data = JSON.stringify({
      msg: 'ok',
      code: 200,
      data: [
        {
          name: 'Mark',
          age: 18
        }
      ]
    })
    // 拼接js代码,假如约定好，前端在成功后需要调用fun这个函数，并将响应的内容注入进去
    const javascriptString = `fun(${ data })`
    res.end(javascriptString)
  }
})

server.listen(8080)