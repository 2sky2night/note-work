<template>
  <div class="container" ref="containerDOM">
    <ul class="list">
      <TransitionGroup name="card">
        <li :key="index" v-for="( item, index ) in list">
          <span>{{ index+1 }}</span>
          <img :src="item">
        </li>
      </TransitionGroup>
    </ul>
    <span v-if="isLoading">加载中</span>
  </div>
</template>

<script lang='ts' setup>
// 使用 css的column 布局使用最简单的瀑布流 但兼容性最差
import { onMounted, reactive, ref } from 'vue'

const temp = [ 'src/imgs/01.png',
  'src/imgs/03.png',
  'src/imgs/02.png',
  'src/imgs/01.png',
  'src/imgs/03.png',
  'src/imgs/02.png',
  'src/imgs/03.png',
  'src/imgs/02.png',
  'src/imgs/03.png',
  'src/imgs/01.png',
  'src/imgs/01.png',
  'src/imgs/03.png',
  'src/imgs/03.png',
  'src/imgs/02.png',
  'src/imgs/01.png',
  'src/imgs/02.png',
  'src/imgs/01.png',
  'src/imgs/02.png', ]

const list = reactive<string[]>([ ...temp ])
const containerDOM = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)


function getData () {
  if (isLoading.value) {
    return
  }
  isLoading.value = true
  setTimeout(() => {
    temp.forEach(ele => {
      list.push(ele)
    })
    isLoading.value = false
  }, 1000)
}

onMounted(() => {
  if (containerDOM.value) {
    const target = containerDOM.value as HTMLDivElement;
    containerDOM.value.addEventListener('scroll', () => {
      if (target.clientHeight + target.scrollTop >= target.scrollHeight) {
        getData()
      }
    })
  }
})

</script>

<style scoped lang='scss'>
.container {
  height: 800px;
  overflow-y: scroll;
  padding: 10px;


  .list {
    // 两行代码实现瀑布流，这种方式会让DOM竖向排列，竖向装不下就从下一列开始排列
    // 缺点：动态加载列表项时，每一次加载都会导致所有项的位置被打乱
    column-count: 4;
    column-gap: 10px;

    li {
      position: relative;
      span{
        position: absolute;
        background-color: red;
        color:#fff;
        padding: 5px 15px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

  }
}

.card-enter-active {
  animation: MoveCard .3s 1 ease;
}


@keyframes MoveCard {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>