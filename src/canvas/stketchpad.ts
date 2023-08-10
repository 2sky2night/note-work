/**
 * 模式类型
 */
export type ModeType = 'drawing' | 'eraser'

/**
 * 配置项
 */
export interface Options {
  /**
   * 操作哪个画布容器？
   */
  el: HTMLCanvasElement;
  /**
   * 历史记录更新的回调
   */
  handelHistoryUpdate?: any;
}
/**
 * 目前支持功能
 * 1.自由画图模式
 * 2.橡皮擦模式
 * 需要完善的
 * 1.橡皮擦指针显示功能
 * 2.在擦橡皮时，若无内容则不擦除内容,不保存到历史记录里
 */
/**
 * 画板
 */
class Stketchpad {
  /**
   * canvans元素
   */
  $el: HTMLCanvasElement;
  /**
   * 模式 默认自由画图模式drawing eraser为橡皮擦模型
   */
  mode: ModeType
  /**
   * 画布上下文
   */
  ctx!: CanvasRenderingContext2D;
  /**
   * 步骤栈，保存每一步操作记录的
   */
  imageDatastack: {
    data: ImageData;
    id: number;
    /**
     * 栈帧
     */
    header: boolean;
  }[];
  /**
   * 历史记录更新的回调
   */
  handleHistory: any;
  /**
   * 构造器
   * @param el 需要控制哪个画布元素？
   */
  constructor (option: Options) {
    // 获取DOM
    this.$el = option.el
    // 初始化画板模式
    this.mode = 'drawing'
    // 初始化历史记录
    this.imageDatastack = []
    // 初始化历史记录更新的回调
    if (option.handelHistoryUpdate) {
      this.handleHistory = option.handelHistoryUpdate
    } else {
      this.handleHistory = () => { }
    }
    // 获取上下文
    const ctx = this.$el.getContext('2d')
    if (ctx) {
      this.ctx = ctx
      this.init()
    } else {
      new Error('Can not get canvas context!')
    }
  }
  /**
   * 初始化
   */
  init () {
    if (this.mode === 'drawing') {
      this.drawingMode()
    }
  }
  /**
   * 模式切换
   */
  changeMode (value: ModeType) {
    // 移出所有画布实例的事件回调
    this.$el.onmousedown = null
    this.$el.onmousemove = null
    this.$el.onmouseleave = null
    this.$el.onmouseup = null
    // 根据传入的值切换对应样式
    switch (value) {
      case 'drawing': this.drawingMode(); break;
      case 'eraser': this.eraserMode(); break;
    }
  }
  /**
   * 橡皮擦模式
   */
  eraserMode () {
    // 鼠标按下的回调
    const onHandleMouseDown = (e: MouseEvent) => {
      // 擦去内容
      this.ctx.clearRect(e.offsetX - this.ctx.lineWidth / 2, e.offsetY - this.ctx.lineWidth / 2, this.ctx.lineWidth, this.ctx.lineWidth)
      // 保存当前画布内容
      this.pushStack()
      // 绑定鼠标滑动的回调
      this.$el.onmousemove = onHandleMouseMove
      // 绑定移除鼠标滑动回调
      this.$el.onmouseleave = removeMove
      this.$el.onmouseup = removeMove
    }
    // 鼠标移动的回调
    const onHandleMouseMove = (e: MouseEvent) => {
      // 擦去内容
      this.ctx.clearRect(e.offsetX - this.ctx.lineWidth / 2, e.offsetY - this.ctx.lineWidth / 2, this.ctx.lineWidth, this.ctx.lineWidth)
    }
    // 移出移动事件回调
    const removeMove = () => {
      // 当松手后 保存当前画布内容
      this.pushStack()
      // 移出所有副作用事件监听 
      this.$el.onmousemove = null
      this.$el.onmouseup = null
      this.$el.onmouseleave = null
    }

    this.$el.onmousedown = onHandleMouseDown

  }
  /**
   * 将画布置为自由画图模式
   */
  drawingMode () {

    // 鼠标按下后的回调
    const onHandleMouseDown = (e: MouseEvent) => {
      // 绘制新路径 每次按下鼠标到滑动鼠标到抬起鼠标为一段完整的路径
      this.ctx.beginPath()
      // 鼠标按下后需要让画笔落在按下时的坐标处
      this.ctx.moveTo(e.offsetX, e.offsetY)
      // 绑定滑动事件处理函数，从起始位置绘制线段
      this.$el.onmousemove = onHandleMouseMove
      // 鼠标抬起或离开时的回调
      this.$el.onmouseup = onHandleRemoveMove
      this.$el.onmouseleave = onHandleRemoveMove
    }

    // 鼠标在画布上滑动时的回调
    const onHandleMouseMove = (e: MouseEvent) => {
      // 鼠标移动时，绘制一个像素点级的直线路径
      this.ctx.lineTo(e.offsetX, e.offsetY)
      // 渲染路径
      this.ctx.stroke()
    }

    // 鼠标抬起或鼠标移出画布的回调
    const onHandleRemoveMove = () => {
      // 完整的路径画完后 再保存当前画布内容
      this.pushStack()
      // 移出所有副作用事件监听 
      this.$el.onmousemove = null
      this.$el.onmouseup = null
      this.$el.onmouseleave = null
    }
    // 鼠标按下时的回调
    this.$el.onmousedown = onHandleMouseDown;
  }
  /**
   * 将当前画布内容保存到栈中
   */
  pushStack () {
    // 将当前所有的历史记录的所有栈整设置为false
    this.imageDatastack.forEach(ele => ele.header = false)
    // 保存历史记录
    this.imageDatastack.push({
      data: this.getImageData(),
      id: Date.now(),
      // 刚入栈，设置栈帧
      header: true
    })
    this.handleHistory()
  }
  /**
   * 将当前画布内容弹出栈（软出栈,只是改变header标志位，设置当前栈帧）
   * @returns null或前一个历史记录
   */
  popStack () {
    // 获取当前最后一个历史记录，把他改为false，把他的前一个改为true
    // 若当前只有一个历史记录，把他改为false
    if (this.imageDatastack.length) {
      // 获取当前的画布内容
      const index = this.imageDatastack.findIndex(ele => ele.header)
      if (index !== -1) {
        const item = this.imageDatastack[ index ]
        item.header = false
        if (index === 0) {
          // 若当前为第一个历史记录
          this.handleHistory()
          return null
        }
        // 获取前一个历史记录 把他设置为true
        const preItem = this.imageDatastack[ index - 1 ]
        preItem.header = true
        this.handleHistory()
        return preItem
      }
      return null
    }
    return null
  }
  /**
   * 后退一步，将画布内容退回到上一步中
   */
  stepBack () {
    if (this.imageDatastack.length && this.imageDatastack.some(ele => ele.header)) {
      // 从历史记录中弹出当前画布
      const res = this.popStack()
      if (res) {
        this.putImageData(res.data)
      } else {
        // 当前没有历史记录或已经退回到初始状态了，重置画布
        this.ctx.clearRect(0, 0, this.$el.clientWidth, this.$el.clientHeight)
      }
    } else {
      console.log('不能再后退了!');
    }
  }
  /**
   * 前进
   */
  forward () {
    if (this.imageDatastack.length) {
      if (this.imageDatastack.every(ele => !ele.header)) {
        // 若每一个栈帧都是false
        // 则直接渲染第一个历史记录
        this.putImageData(this.imageDatastack[ 0 ].data)
        this.imageDatastack[ 0 ].header = true
        this.handleHistory()
        return
      }
      // 若当前栈帧为最后一个则不能前进
      // 若当前不为最后一个则将当前栈帧设置为false，后一个栈帧设置为true
      const index = this.imageDatastack.findIndex(ele => ele.header)
      if (index === this.imageDatastack.length - 1) {
        console.log('不能前进!');
        return
      }
      this.imageDatastack[ index ].header = false
      // 将后一个设置为true
      this.imageDatastack[ index + 1 ].header = true
      // 将当前画布渲染成后一个的画布数据
      this.putImageData(this.imageDatastack[ index + 1 ].data)
      this.handleHistory()
    } else {
      console.log('不能前进!');
    }
  }
  /**
   * 获取画布栈
   * @returns 画布栈
   */
  getStack () {
    return this.imageDatastack
  }
  /**
   * 获取当前画布内容
   */
  getImageData () {
    // 获取当前画布的图像数据
    return this.ctx.getImageData(0, 0, this.$el.clientWidth, this.$el.clientHeight)
  }
  /**
   * 通过图像数据，填充画布内容
   * @param data 画布数据
   */
  putImageData (data: ImageData) {
    this.ctx.putImageData(data, 0, 0)
  }
  /**
   * 设置路径颜色
   * @param color 颜色值
   */
  changeLineColor (color: string) {
    this.ctx.strokeStyle = color
  }
  /**
   * 设置填充的颜色
   * @param color 颜色值
   */
  changeFillColor (color: string) {
    this.ctx.fillStyle = color
  }
  /**
   * 设置路径的粗细
   * @param lineWidth 
   */
  changeLineWidth (lineWidth: number) {
    this.ctx.lineWidth = lineWidth
  }
}

export default Stketchpad