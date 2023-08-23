<template>
  <input type="file" ref="fileDOM" @change="onHandleChange">
</template>

<script lang='ts' setup>
import axios from 'axios'
import { ref } from 'vue'
const fileDOM = ref<HTMLInputElement | null>(null)
let data: null | File = null
const size = 1024 * 1024
const emits = defineEmits<{ fileload: [] }>()

const onHandleChange = () => {
  const target = fileDOM.value as HTMLInputElement
  // @ts-ignore
  const file = target.files[ 0 ]
  // 未选择文件
  if (!file) {
    data = null
  } else {
    data = file
    // 切割文件 1mb片
    const fileChunk = createFileChunk(file, size)
    uploadFileChunk(fileChunk)
  }
}

// 文件切片 默认1kb的切割文件
const createFileChunk = (file: File, size = 1024) => {
  const fileChunkList: { chunk: Blob }[] = []
  for (let i = 0; i < file.size; i += size) {
    fileChunkList.push({ chunk: file.slice(i, i + size) })
  }
  return fileChunkList
}

// 上传切片
const uploadFileChunk = async (chunkList: { chunk: Blob }[]) => {
  // 一个切片一个切片的上传
  const reqList = chunkList.map(({ chunk }, index) => {
    const body = new FormData()
    const fileName = (data as File).name
    // 分片文件
    body.append('chunk', chunk)
    // 上传分片文件的名称
    body.append('chunk-name', fileName + '_' + index)
    // 上传文件的名称
    body.append('file-name', fileName.slice(0, fileName.lastIndexOf('.')))
    return axios.post<{ chunkName: string; fileName: string; msg: string; }>('http://127.0.0.1:3000/file-chunk', body)
    // return new Promise<void>(r => {
    //   const formdata = new FormData()
    //   formdata.append('file', file)
    //   const xhr = new XMLHttpRequest()
    //   xhr.open('post', 'http://127.0.0.1:3000/file-upload')
    //   xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    //   xhr.send()
    //   xhr.onload = () => {
    //     r()
    //   }
    // })
  })
  const res = await Promise.all(reqList)
  console.log('分片全部上传完成!', res);
  // 通过文件名称，来合并文件(不包括扩展名)
  mergeFile(res[ 0 ].data.fileName, size)
}

// 合并切片 (发送文件名称，让后端接受到后去合并文件,发送切片大小，可以按照字节顺序依次写入文件)
const mergeFile = async (fileName: string, size: number) => {
  const res = await axios.get('http://127.0.0.1:3000/merge-file', { params: { fileName, size } })
  console.log(res);
  emits('fileload')
}

</script>