<template>
  <upload @fileload="getList"/>
  <div class="container">
    <div class="list">
      <FileItem v-for="item in list" :origin_name="item.origin_name" :ext="item.ext" :name="item.name" :size="item.size" ></FileItem>
    </div>
  </div>
</template>

<script lang='ts' setup>
import upload from './upload.vue';
import { onBeforeMount, reactive } from 'vue'
import FileItem from './FileItem.vue';
interface Item {
  origin_name: string;
  size: number;
  name: string;
  ext: string;
}

const list = reactive<Item[]>([])

async function getList () {
  list.length = 0;
  const res = await new Promise<Item[]>(r => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', 'http://127.0.0.1:3000/files')
    xhr.send()
    xhr.onload = (e) => {
      // @ts-ignore
      const res: Item[] = JSON.parse(e.target.response)
      r(res)
    }
  })
  res.forEach(ele => list.push(ele))

}

onBeforeMount(getList)

defineOptions({
  name: 'Files'
})
</script>


<style lang="scss" scoped>
.container{
  padding: 10px;
}
.list {
  display: flex;
  flex-wrap: wrap;
}
</style>
