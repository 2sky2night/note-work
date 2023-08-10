<template>
  <canvas ref="canvasIns"></canvas>
  <!-- <button @click="onHandleDownload">生成图片</button> -->
</template>

<script lang='ts' setup>
import { ref, onMounted } from 'vue'

const canvasIns = ref<HTMLCanvasElement | null>(null)
const width = ref(0)
const position = {
  x: 0,
  y: 0
}


const onHandleDownload = () => {
  const canvasDOM = canvasIns.value as HTMLCanvasElement
  canvasDOM.toBlob((blob) => {
    if (blob) {
      const img = document.createElement('img')
      const url = URL.createObjectURL(blob)
      img.onload = () => {
        URL.revokeObjectURL(url);
      }
      img.src = url
    }
  })
}

onMounted(() => {
  const canvasDOM = canvasIns.value as HTMLCanvasElement
  //  获取画布上下文，可以绘制画布内容
  const ctx = canvasDOM.getContext('2d')
  // ctx && draw(ctx)
  resetClient()
  window.addEventListener('resize', resetClient)
  function resetClient () {
    width.value = window.innerWidth
  }

  // 写字板逻辑
  if (ctx) {

    // 鼠标在画布上滑动事件的回调
    const handleMouseMove = (e: MouseEvent) => {
      // 鼠标移动在哪儿就立即画路径
      ctx.lineTo(e.offsetX, e.offsetY)
      // 立即渲染路径
      ctx.stroke()
    }

    // 鼠标在画布上按下的回调
    const handleMouseDown = (e: MouseEvent) => {
      // 记录鼠标按下时的位置
      const startPosition = {
        x: e.offsetX,
        y: e.offsetY
      }
      // 创建路径
      ctx.beginPath()
      // 让画笔落在按下的位置
      ctx.moveTo(startPosition.x, startPosition.y)
      // 绑定鼠标滑动的回调
      canvasDOM.addEventListener('mousemove', handleMouseMove)
    }

    // 鼠标在画布上松开的回调(移除滑动的回调)
    const handleMouseUp = () => {
      canvasDOM.removeEventListener('mousemove', handleMouseMove)
    }

    // 鼠标按下事件监听
    canvasDOM.addEventListener('mousedown', handleMouseDown)
    // 鼠标抬起事件监听
    canvasDOM.addEventListener('mouseup', handleMouseUp)
  }

})

function draw (ctx: CanvasRenderingContext2D) {
  ctx.beginPath()

  ctx.stroke()
}

// 渲染一堆方块
function drawRects (ctx: CanvasRenderingContext2D) {
  const rectWidth = 50
  const rectHeight = 50
  const row = 10
  const column = 10
  setInterval(() => {
    ctx.clearRect(0, 0, width.value, 150)
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        ctx.fillStyle = `rgb(${ Math.random() * 60 * j },${ Math.random() * 60 * i }, ${ Math.random() * 60 * j })`
        ctx.fillRect(j * rectWidth, i * rectHeight, rectWidth, rectHeight)
      }
    }
  }, 1000)
}

// 绘制保存好的路径
function drawPath (ctx: CanvasRenderingContext2D) {

  // 能绘制vue图标的路径
  function drawVue () {
    const pathVue = new Path2D()
    pathVue.moveTo(10, 10)
    pathVue.lineTo(30, 50)
    pathVue.lineTo(50, 10)
    pathVue.lineTo(40, 10)
    pathVue.lineTo(30, 40)
    pathVue.lineTo(20, 10)
    pathVue.closePath()
    return pathVue
  }
  // 绘制图形的路径
  function drawRect () {
    const path = new Path2D()
    path.arc(80, 40, 20, 0, Math.PI * 2)
    return path
  }

  ctx.fillStyle = '#42b984'
  ctx.fill(drawVue())
  ctx.moveTo(100, 70)
  ctx.fillStyle = 'green'
  ctx.fill(drawRect())
}

// 绘制贝塞尔曲线
function drawBeiSaiEr (ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.moveTo(50, 50)
  // 前两个参数是突出的坐标，后两个是路径结束的坐标
  ctx.quadraticCurveTo(25, 75, 50, 100)
  ctx.moveTo(50, 100)
  ctx.quadraticCurveTo(75, 75, 50, 50)
  ctx.stroke()
}

//  绘制圆形
function drawRotundity (ctx: CanvasRenderingContext2D) {
  // 创建一个新路径
  ctx.beginPath()
  // 绘制一个圆形，前两个参数是圆心的x，y坐标，第三个是半径，第三个和第四个是圆的起始和终末弧度
  // Math.PI=3.14代表180° 弧度公式=(Math.PI/180)*角度。
  ctx.arc(75, 75, 50, 0, Math.PI * 2)
  // 画完后，提笔将画笔落在110，75处也就是半圆的起始位置
  ctx.moveTo(110, 75)
  ctx.arc(75, 75, 35, 0, (Math.PI / 180) * 180)
  // 画完后，提笔将笔落在60，50处，也就是眼睛的起始位置
  ctx.moveTo(60, 55)
  ctx.arc(50, 55, 10, 0, Math.PI * 2)
  // 画完后，提笔落在110，50处，也就是眼睛的起始位置
  ctx.moveTo(110, 55)
  ctx.arc(100, 55, 10, 0, Math.PI * 2)

  ctx.stroke()
}

// 画多条线
function drawLines (ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  // 画第一条线
  ctx.moveTo(20, 20)
  ctx.lineTo(20, 50)
  ctx.lineTo(30, 20)
  // 提笔画第二条线
  ctx.moveTo(80, 80)
  ctx.lineTo(100, 80)
  // 线的颜色
  ctx.strokeStyle = 'red'
  ctx.stroke()
}


// 绘制三角形
function drawTriangle (ctx: CanvasRenderingContext2D) {
  // 创建一个新路径
  ctx.beginPath()
  // 路径从哪儿开始？（落笔画线，但画出来的都是透明的线）
  ctx.moveTo(50, 10)
  // 移动画笔到目标位置
  ctx.lineTo(75, 30)
  ctx.lineTo(25, 30)
  // fill会将路径的起始点和终点连接起来绘制渲染实心区域
  ctx.fillStyle = 'red'
  ctx.fill()
}

// 绘制路径
function drawPathStroke (ctx: CanvasRenderingContext2D) {
  // 创建一个新路径
  ctx.beginPath()
  // 路径从哪儿开始？（落笔画线）
  ctx.moveTo(50, 10)
  // 移动画笔到目标位置(此时不会渲染路径) lineTo绘制直线
  ctx.lineTo(75, 30)
  ctx.lineTo(25, 30)
  // closePath会将路径的起始点和终点连接起来形成闭合区域
  ctx.closePath()
  // stroke，将路径渲染出来
  ctx.stroke()
}

// 绘制矩形边框
function drawRectStroke (ctx: CanvasRenderingContext2D) {
  // 绘制一个矩形路径
  // ctx.rect(20, 20, 100, 100)
  // 等同于 
  ctx.moveTo(20, 20)
  ctx.lineTo(120, 20) // lineTo绘制直线
  ctx.lineTo(120, 120)
  ctx.lineTo(20, 120)
  ctx.closePath()
  // 渲染路径
  ctx.stroke()
}

// 绘制实心矩形
function drawFillRect (ctx: CanvasRenderingContext2D) {
  // 填充时颜色
  ctx.fillStyle = 'red'
  // fillRect在画布中绘制一个矩形
  ctx.fillRect(10, 10, 50, 50);
  ctx.fillStyle = 'skyblue'
  ctx.fillRect(20, 20, 10, 10)
  ctx.fillRect(40, 20, 10, 10)
  ctx.fillRect(20, 40, 30, 10)
  // 渲染文本
  ctx.fillText('我靠', 10, 70, 100)
  // 渲染举行边框
  ctx.strokeRect(70, 10, 50, 50)
  // 橡皮擦
  // ctx.clearRect(10, 10, 50, 50)
}


</script>

<style scoped lang="scss">
canvas {
  margin: 50px;
  border: 1px solid #eee;
}
</style>
