<template>
  <div class="sketchpad-container" :style="{ width: width !== undefined ? width + 'px' : '100%' }">
    <div class="tools-panel">
      <div class="left">
        <input type="color" id="color" @change="onHandleChangeColor" :value="canvasOption.lineColor">
        <select v-model="selectWidth">
          <option label="粗" value="10"></option>
          <option label="一般" value="5"></option>
          <option label="细" value="1"></option>
        </select>
        <div :class="{ 'active-eraser': canvasOption.mode === 'eraser' }" @click="onHandleChangeMode">橡皮擦
        </div>
      </div>
      <div class="right">
        <span style="margin-right: 10px;" @click="onHandleStepBack">撤销</span>
        <span @click="onHandleForward">前进</span>
      </div>
    </div>
    <div class="canvas-container">
      <canvas ref="canvasRef" :height="height !== undefined ? height : undefined"></canvas>
    </div>
    <ul>
      历史记录
      <li v-for="item in historyStack" :key="item.id">{{ item }}</li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, reactive, computed, onBeforeUnmount } from 'vue'
import Stketchpad, { type ModeType } from './stketchpad'

// props
const props = defineProps<{
  /**
   * 画布宽度
   */
  width?: number;
  /**
   * 画布高度
   */
  height?: number;
}>()
// 画布实例
const canvasRef = ref<HTMLCanvasElement | null>(null)
// 画布配置项
const canvasOption = reactive<{ lineColor: string, lineWidth: number; mode: ModeType }>({
  lineColor: '#000000',
  lineWidth: 1,
  mode: 'drawing'
})
// 当前选择的路径粗细
const selectWidth = computed({
  get () {
    switch (canvasOption.lineWidth) {
      case 10: return "10";
      case 5: return "5";
      case 1:
      default: return "1"
    }
  },
  set (value: string) {
    switch (value) {
      case "10": canvasOption.lineWidth = 10; break;
      case "5": canvasOption.lineWidth = 5; break;
      case "1":
      default: canvasOption.lineWidth = 1; break;
    }
    stketchpadIns && stketchpadIns.changeLineWidth(canvasOption.lineWidth)
  }
})
// 当前历史记录栈
const historyStack = reactive<{ id: number, header: boolean }[]>([])
// 画板实例
let stketchpadIns: null | Stketchpad = null

/**
 * 改变路径颜色
 */
const onHandleChangeColor = (e: Event) => {
  const target = e.target as HTMLInputElement
  canvasOption.lineColor = target.value
  stketchpadIns && stketchpadIns.changeLineColor(canvasOption.lineColor)
}
/**
 * 改变当前画布的模式
 */
const onHandleChangeMode = () => {
  if (canvasOption.mode === 'eraser') {
    // 当前是橡皮擦模式就切换成画板模式
    canvasOption.mode = 'drawing'
  } else {
    // 非橡皮擦模式点击进入橡皮擦模式
    canvasOption.mode = 'eraser'
  }
  stketchpadIns && stketchpadIns.changeMode(canvasOption.mode)
}

/**
 * 后退一步
 */
const onHandleStepBack = () => {
  stketchpadIns && stketchpadIns.stepBack()
}
/**
 * 前进
 */
const onHandleForward = () => {
  stketchpadIns && stketchpadIns.forward()
  
}

onMounted(() => {
  const canvasDOM = canvasRef.value as HTMLCanvasElement
  stketchpadIns = new Stketchpad({
    el: canvasDOM,
    handelHistoryUpdate () {
      stketchpadIns && (() => {
        historyStack.length = 0
        // 获取历史记录的id
        const list = stketchpadIns.getStack();
        [...list].reverse().forEach(ele => historyStack.push({ id: ele.id, header: ele.header }))
      })()
    }
  })
  // 初始化画板的配置
  stketchpadIns.changeLineColor(canvasOption.lineColor)
  stketchpadIns.changeLineWidth(canvasOption.lineWidth)


  // 设置画板宽度
  if (props.width) {
    // 指定了画板宽度，则宽度是固定死的
    canvasDOM.width = props.width
  } else {
    // 未指定画板宽度  则画板宽度与外部容器宽度保持一致
    // 视口变化调整cavnas的宽度
    const onHandleResize = () => {
      if (stketchpadIns) {
        // 调整画布大小之前，先保存画布内容
        const data = stketchpadIns.getImageData()

        if (canvasDOM.parentElement) {
          canvasDOM.width = canvasDOM.parentElement.clientWidth
        } else {
          canvasDOM.width = window.innerWidth
        }

        // 恢复画布内容
        stketchpadIns.putImageData(data)
        // 重置画布会初始化各种配置，需要手动重新设置
        stketchpadIns.changeLineColor(canvasOption.lineColor)
        stketchpadIns.changeLineWidth(canvasOption.lineWidth)
      }
    }
    onHandleResize()
    window.addEventListener('resize', onHandleResize)
    onBeforeUnmount(() => {
      window.removeEventListener('resize', onHandleResize)
    })
  }
})



</script>

<style scoped lang='scss'>
.sketchpad-container {
  .tools-panel {
    background-color: #eee;
    user-select: none;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left,
    .right {
      height: 100%;
      display: flex;
      align-items: center;
    }

    #color {
      height: 100%;
      width: 30px;
    }

    .active-eraser {
      color: red;
    }
  }

  .canvas-container {
    border: 1px #eee solid;
  }
}
</style>