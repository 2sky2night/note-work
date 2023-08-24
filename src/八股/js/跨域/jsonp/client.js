// 提供客户端渲染
const server = require('http').createServer()
const fs = require('fs')
server.on('request', (_, res) => {

  res.setHeader('Content-type', 'text')
  const htmlString = fs.readFileSync('./index.html', 'utf-8')
  res.end(htmlString)
})

server.listen(80)