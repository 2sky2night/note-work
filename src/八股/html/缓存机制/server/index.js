const server = require('http').createServer().listen(3000)
const path = require('path')
const fs = require('fs')

server.on('request', (req, res) => {
  console.log(req.url);
  executorMiddleware(middlewares, req, res)
})

async function executorMiddleware(middlewares, req, res) {
  for (let i = 0; i < middlewares.length; i++) {
    const result = await middlewares[i](req, res)
    if (result === false) {
      break
    }
  }
}

const middlewares = [
  async function getCilent(req, res) {
    try {
      if (req.url === '/') {
        const data = await getStrStatic('/client/index.html')
        res.setHeader('content-type', 'text/html')
        res.end(data)
        return false
      } else {
        return true
      }
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.end('server error!')
      return false
    }
  },
  async function getImgStatic(req, res) {
    try {
      if (req.url.substring(0, 7) === '/static') {
        const truePath = req.url.substring(7) // 解析出真实路径
        const data = await getStatic(truePath)
        res.setHeader('Cache-Control', 'max-age=10') // 设置缓存有效期为10s
        res.setHeader('content-type', 'image')
        res.end(data)
        return false
      } else {
        return true
      }
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.end('server error!')
      return false
    }
  },
  async function getClientStatic(req, res) {
    try {
      if (req.url.includes('.js') || req.url.includes('.css')) {
        const data = await getStrStatic(`/client/${req.url}`)
        res.setHeader('Cache-Control', 'max-age=100') // 设置缓存有效期为100s
        res.end(data)
        return false
      } else {
        return true
      }
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.end('server error!')
      return false
    }
  },
  function (req, res) {
    res.statusCode = 404
    res.end('404 not found~')
    return false
  }
]

function getStrStatic(filePath) {
  return new Promise((resolve, reject) => {
    let str = ''
    const rootPath = path.resolve(__dirname, `../${filePath}`)
    if (fs.existsSync(rootPath)) {
      const rs = fs.createReadStream(rootPath, 'utf-8')
      rs.on('data', (chunk) => (str += chunk))
      rs.on('error', () => reject(`Read file error!File path:${rootPath}`))
      rs.on('end', () => resolve(str))
    } else {
      reject('File is not found! File path:' + rootPath)
    }
  })
}

function getStatic(filePath) {
  return new Promise((resolve, reject) => {
    const chunkList = []
    const rootPath = path.resolve(__dirname, `../${filePath}`)
    if (fs.existsSync(rootPath)) {
      const rs = fs.createReadStream(rootPath)
      rs.on('data', (chunk) => chunkList.push(chunk))
      rs.on('error', () => reject(`Read file error!File path:${rootPath}`))
      rs.on('end', () => resolve(Buffer.concat(chunkList)))
    } else {
      reject('File is not found! File path:' + rootPath)
    }
  })
}
