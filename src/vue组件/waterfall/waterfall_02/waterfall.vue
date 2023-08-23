<template>
  <div class="container" ref="containerDOM">
    <ul class="img-lists">
      <li class="items" v-for="( item, index ) in list" :key="item.id">
        <span>{{ index + 1 }}</span>
        <img :data-url="item.url">
      </li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import ImageVue from './image.vue';
import WaterFallResolve from './index'
interface Item { id: string; url: string }

// 容器DOM
const containerDOM = ref<HTMLDivElement | null>(null)
// 请求地址
const REQUEST_PATH = 'https://api.thedogapi.com/v1/images/search?limit=10'
// 图片列表
const list = reactive<Item[]>([])
// 正在加载
const isLoading = ref(false)


onMounted(() => {
  if (containerDOM.value) {
    const target = containerDOM.value as HTMLDivElement
    const ins = new WaterFallResolve({
      el: target.children[ 0 ] as HTMLElement,
      columnCount: 3,
      gap: 10
    })

    // 获取数据的函数
    const getData = async () => {
      if (isLoading.value) return
      isLoading.value = true
      await new Promise<void>((r) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', REQUEST_PATH)
        xhr.send()
        xhr.onload = (ev) => {
          // @ts-ignore
          const res: Item[] = JSON.parse(ev.target.response)
          res.forEach(ele => list.push({ id: ele.id, url: ele.url }))
          r()
        }
      })

      isLoading.value = false;
      nextTick(() => {
        ins.render()
      })
    }

    getData()

    target.addEventListener('scroll', () => {
      if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
        getData()
      }
    })
  }
})

</script>

<style scoped lang='scss'>
.container {
  height: 500px;
  overflow-y: auto;

  .img-lists {
    .items {
      span {
        background-color: red;
        color: #fff;
        position: absolute;
        top: 0;
      }

      img {
        width: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>