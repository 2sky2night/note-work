import Router from 'koa-router'
import fs from 'fs'
import path from 'path'
import koaBody from 'koa-body'
import multer from '@koa/multer'

const router = new Router()
// multer实例
const upload = multer();

router.get('/download', async (ctx) => {
  // 下载
  const fileName = ctx.query.fileName
  if (fileName === undefined) {
    return ctx.body = '未携带参数!'
  }
  // 从当前工作目录中开始读取文件名称
  const fileList = fs.readdirSync('./static/file');
  if (fileList.some(ele => ele === fileName)) {
    // 文件存在
    // 从当前工作目录中开始读取文件
    const filePath = path.resolve(`./static/file/${ fileName }`)
    const res = await new Promise<Buffer | string>(r => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          r('error')
        } else {
          // attachment 表示让浏览器强制下载
          // filename 用于设置下载弹出框里预填的文件名
          ctx.set("Access-Control-Expose-Headers", "content-disposition");
          ctx.set(
            "Content-disposition",
            // 设置文件的名称
            "attachment;filename=" + encodeURIComponent(fileName as string)
          );
          r(data)
        }
      })
    })
    console.log(res);

    ctx.body = {
      url: `${ ctx.origin }/file/${ fileName }`,
      size: res.length
    }
  } else {
    // 文件不存在
    ctx.body = '文件不存在!'
  }
})

router.get('/files', async (ctx) => {
  // 从当前工作目录中开始读取文件名称
  const res = fs.readdirSync('./static/file');

  ctx.body = await Promise.all(res.map(async (ele) => {
    // 读取每个文件
    const file = fs.readFileSync(path.resolve(`./static/file/${ ele }`))

    return {
      origin_name: ele,
      name: ele.split('.')[ 0 ],
      ext: ele.split('.')[ 1 ],
      size: file.length
    }
  }))
})

// 小文件上传
router.post('/file-upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: 'static/file',
    keepExtensions: true,
    // 允许上传文件的大小为1gb
    maxFileSize: 1024 * 1024 * 1024,
    onFileBegin (_name, file) {
      // 查询最后一个句号的索引
      // @ts-ignore
      const index = file.originalFilename.lastIndexOf('.')
      // @ts-ignore
      const newFilename = file.originalFilename.substring(0, index) + '_' + file.newFilename
      // 替换文件保存位置
      file.filepath = file.filepath.replace(file.newFilename, newFilename)
      file.newFilename = newFilename
    },
  }
}), (ctx) => {
  // @ts-ignore
  const file: any = ctx.request.files.file
  if (file) {
    ctx.body = {
      url: `${ ctx.origin }/file/${ file.newFilename }`,
      size: file.size
    }

  } else {
    ctx.body = null
  }
})

// 文件分片上传
// router.post(
//   '/file-chunk',
//   async (ctx, next) => {
//     // 解析请求体的数据
//     const data = await new Promise<Buffer>(r => {
//       const files: any[] = []
//       // 监听req的data事件，获取用户上传的文件流
//       ctx.req.on('data', data => {
//         files.push(data)
//       })
//       // 监听end事件，传输完成，将所有数据文件数据拼接成buffer
//       ctx.req.on('end', () => {
//         r(Buffer.concat(files))
//       })
//     })
//     // 将分片数据保存在上下文
//     // @ts-ignore
//     ctx.request.chunk = data
//     await next()
//   },
//   async (ctx) => {
//     // @ts-ignore
//     let data: Buffer = ctx.request.chunk
//     // 获取请求体类型
//     const contentType = ctx.request.header[ 'content-type' ] as string
//     // 获取分割符号
//     const splitString = contentType.slice(contentType.indexOf('=') + 1)

//     let arr = [];
//     let n=0
//     while ((n = data.indexOf(splitString)) != -1) {
//       arr.push(data.slice(0, n));
//       data = data.slice(n + splitString.length);
//     }
//     console.log(arr);
//     // arr.pop()
//     // arr.shift()

//     ctx.body = arr
//   }
// )

// 文件分片上传
// 使用@koa/multer可以自动配置上传form-data时的字段名，从而进行解析
// 非文件字段会被保存到ctx.request.body中
// 文件字段会被保存到ctx.request.files中
router.post(
  '/file-chunk',
  // 解析请求体中的字段（文件字段必须声明，非文件字段可声明可不声明）
  upload.fields(
    [
      {
        // 分片名（分片名称的格式 xxx.png_0）
        name: 'chunk-name'
      },
      {
        // 分片文件
        name: 'chunk',
        maxCount: 1
      },
      {
        // 文件名称
        name: 'file-name'
      }
    ]
  ),
  (ctx) => {
    // 非文件的form-data字段会被解析到body里
    // console.log(ctx.request.body);
    // 文件会被保存到ctx.request.files中
    // console.log(ctx.request.files);

    // 1.解析form-data中的数据
    // @ts-ignore 获取文件列表
    const fileList: any = ctx.request.files
    // 解析分片文件
    const file = fileList[ 'chunk' ][ 0 ]
    // 解析出分片文件的文件名称
    const chunkName = ctx.request.body[ 'chunk-name' ]
    // 解析出文件的名称(以文件的名称来创建文件夹)
    const fileName = ctx.request.body[ 'file-name' ]

    // 2.创建文件夹，用于存放分片文件（根据文件名称来创建文件夹，将所有分片文件保存到文件夹中）
    // 文件夹路径
    const chunkDirPath = path.resolve('./static/chunk', `./${ fileName }`)
    if (!fs.existsSync(chunkDirPath)) {
      // 文件不存在 创建文件夹
      fs.mkdirSync(chunkDirPath)
    }
    // 3.将当前分片文件保存在分片文件夹中
    const chunkFilePath = path.resolve(chunkDirPath, `./${ chunkName }`)
    // 将文件保存到分片文件夹中
    try {
      fs.writeFileSync(chunkFilePath, file.buffer)
      ctx.body = {
        msg: 'save ok',
        fileName,
        chunkName
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        msg: 'save fail',
        fileName,
        chunkName
      }
    }
  }
)

// 合并切片的文件文件
router.get('/merge-file', async (ctx) => {
  // 解析需要解析的文件名称
  if (ctx.query.fileName === undefined || ctx.query.size === undefined) {
    return ctx.body = 'fileName or size is query need!'
  }
  // 文件名称
  const fileName = ctx.query.fileName as string
  // 分片大小为多少？
  const size = +ctx.query.size

  const res = await resolveMerge(fileName, size)

  if (res === 0) {
    ctx.body = 'file not exist!'
  } else {
    ctx.body = res
  }

})

async function resolveMerge (fileName: string, size: number) {
  // 切片文件夹的路径（一个文件夹代表一个文件）
  const chunkDirPath = path.resolve('./static/chunk', `./${ fileName }`)
  // 1.查询文件是否存在
  if (!fs.existsSync(chunkDirPath)) {
    // 文件不存在
    return Promise.resolve(0)
  }
  // 文件存在
  // 2.读取该切片文件夹中的所有文件名称
  const fileNameList = fs.readdirSync(chunkDirPath)
  // @ts-ignore 切片名称为 xxx.png_0 需要按照索引顺序进行排序，避免文件被混乱的合并
  fileNameList.sort((a, b) => a.split('_')[ 1 ] - b.split('_')[ 1 ])

  // 3.遍历所有切片合并文件，并删除切片文件夹
  const res = fileNameList.map((chunkName, index) => {
    // 当前切片的路径
    const chunkFilePath = path.resolve(chunkDirPath, `./${ chunkName }`)
    // 需要合并的文件路径(合并后文件的路径)
    const filePath = path.resolve('./static/file', `${ chunkName.split('_')[ 0 ] }`)

    // 根据当前切片的路径，访问该切片，将该切片写入到目标文件中
    return pipeStream(
      chunkFilePath,
      // 根据size的指定位置创建可写流
      fs.createWriteStream(filePath, {
        start: index * size
      })
    )
  })
  // 等待全部切片写入完成
  await Promise.all(res)
  // 全部切片写入完成后，就删除该切片文件夹
  fs.rmdirSync(chunkDirPath)

  return Promise.resolve({
    fileName,
    filePath: 'http://127.0.0.1:3000/file' + '/' + fileNameList[ 0 ].split('_')[ 0 ]
  })
}

// 写入文件流
function pipeStream (chunkPath: string, writeStream: fs.WriteStream) {
  return new Promise<void>(r => {
    // 读取切片流
    const readStream = fs.createReadStream(chunkPath)
    // 读取完成就删除该切片
    readStream.on("end", () => {
      fs.unlinkSync(chunkPath)
      r()
    })
    // 将切片流写入到目标文件流中
    readStream.pipe(writeStream)
  })
}

export default router