<template>
  <div class="container" ref="containerDOM">
    <ul class="list">
      <li v-for="(item, index) in list">
        <span>{{ index + 1 }}</span>
        <img :src="item">
      </li>
    </ul>
    <span v-if="isLoading">加载中</span>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue'
import WaterfallResovle from './waterfall';
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

async function getData () {
  if (isLoading.value) {
    return
  }
  isLoading.value = true
  await new Promise<void>(r => {
    setTimeout(() => {
      temp.forEach(ele => {
        list.push(ele)
      })
      isLoading.value = false
      r()
    }, 1000)

  })
}

onMounted(() => {
  if (containerDOM.value) {
    const target = containerDOM.value as HTMLDivElement;

    const ins = new WaterfallResovle({
      el: target.children[ 0 ] as HTMLUListElement,
      column: 3,
      gap: 10
    })
    containerDOM.value.addEventListener('scroll', async () => {
      if (target.clientHeight + target.scrollTop >= target.scrollHeight) {
        await getData()
        ins.renderOk()
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
    li {
      span {
        top: 0;
        left: 0;
        position: absolute;
        padding: 10px;
        background-color: red;
        color: #fff;
      }
    }

    img {
      width: 100%;
    }
  }
}
</style>