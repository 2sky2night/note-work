<template>
  <div class="slider_container">
    <div class="slider_content" :style="{ width: width }">
      <div class="slider_dot" @mousedown="onHandleDown" ref="dotDOM"></div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'

const dotDOM = ref()
const props = withDefaults(defineProps<{
  value?: number;
  max?: number;
}>(), { max: 1, value: 0 })
const emit = defineEmits<{
  'update:value': [ value: number ]
}>()

// 当前滑块的宽度
const width = computed(() => {
  return `${ (props.value / props.max) * 100 }%`
})

// 鼠标点击圆点的回调
const onHandleDown = (e: MouseEvent) => {
  const target = dotDOM.value as HTMLDivElement
  // 获取鼠标在园点上的X坐标
  const offsetX = e.offsetX

  // 鼠标移动的回调
  const onHandleMove = (e1: MouseEvent) => {

    if (e1.offsetX < offsetX) {
      // 左移
      console.log('左移');
      // 每次移动max的百分之一
      // 想要平滑点，就每次移动的越小越连贯，值也就更精确
      if (props.value <= 0) {
        return
      }
      emit('update:value', props.value - props.max * 0.01)
    } else if (e1.offsetX > offsetX) {
      // 右移动
      console.log('右移');
      if (props.value >= props.max) {
        return
      }
      emit('update:value', props.value + props.max * 0.01)
    }
  }

  // 鼠标抬起的回调
  const onHandleUp = () => {
    target.onmousemove = null
    target.onmouseup = null
    target.onmouseleave = null
  }

  // 鼠标离开的回调
  const onHandleLeave = () => {
    target.onmousemove = null
    target.onmouseup = null
    target.onmouseleave = null
  }

  target.onmousemove = onHandleMove
  target.onmouseleave = onHandleLeave
  target.onmouseup=onHandleUp

}

defineOptions({
  name: 'Slider'
})
</script>

<style scoped lang='scss'>
.slider_container {
  background-color: #eee;
  height: 5px;
  border-radius: 5px;

  .slider_content {
    border-radius: 5px;
    background-color: skyblue;
    position: relative;
    height: 100%;
    .slider_dot {
      position: absolute;
      background-color: #fff;
      width: 15px;
      border-radius: 50%;
      height: 15px;
      top: 50%;
      transform: translateY(-50%) translateX(50%);
      ;
      box-shadow: 0 0 10px #00000027;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>