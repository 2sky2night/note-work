<template>
  <Transition appear name="dialog">
    <div class="dialog-container" v-if="isShow">
      <button @click="onHandleClick">close</button>
    </div>
  </Transition>
</template>

<script lang='ts' setup>
import { ref, computed } from 'vue'

const isShow = ref(true);

const props = defineProps<{
  /**
   * 鼠标按下时的坐标
   */
  start: {
    x: number;
    y: number;
  }
}>()

/**
 * 格式化鼠标按下时的偏移量
 */
const formatStart = computed(() => ({
  top: props.start.y + 'px',
  left: props.start.x + 'px'
}))


const emits = defineEmits<{
  'toClose': []
}>()

// 关闭的回调
const onHandleClick = () => {
  isShow.value = false;
  emits('toClose')
}


defineOptions({
  name: 'dialog'
})
</script>

<style scoped lang='scss'>
.dialog-container {
  width: 100px;
  height: 100px;
  background-color: #fff;
  position: absolute;
}

.dialog-enter-active,
.dialog-leave-active {

  transition: .7s ease all;
}

.dialog-enter-from,
.dialog-leave-to {
  top: v-bind('formatStart.top');
  left: v-bind('formatStart.left');
  transform: scale(.5);
  opacity: .5;
}

.dialog-enter-to,.dialog-leave-from {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
}

</style>