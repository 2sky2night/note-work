<template>
  <div class="image-container">
    <TransitionGroup name="img">
      <img v-show="isFinsh" :src="url" key="1">
      <div class="loading" v-show="!isFinsh" key="2">
        <span>加载中</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from 'vue'

const props = defineProps<{ url: string }>();
const isFinsh = ref(false);

onMounted(() => {
  const img = new Image()
  img.src = props.url
  // 图片加载完成 显示图片
  img.onload = () => {
    isFinsh.value = true
  }
})

</script>

<style scoped lang='scss'>
.image-container {
  height: 100%;

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    
  }

  img {
    width: 100%;
    object-fit:contain;
  }
}

.img-enter-active {
  animation: imgMove .3s 1 ease;
}

.img-leave-active {
  animation: imgMove .3s 1 ease reverse;
}

@keyframes imgMove {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}</style>