<template>
  <div class="upload_container">
    <div class="drop_container" :class="{ 'active': isActive }" @dragover.prevent=""
      @dragenter.prevent="onHandleDragEnter" @dragleave.prevent="onHandleDragLeave" @drop="onHandleDrop">
      将文件拖拽到此处
    </div>
    <div class="item" v-for="item in fileList">
      {{ item.name }} -- {{ (item.size / 1024).toFixed(2) }}kb
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, watch } from 'vue'

const fileList = reactive<File[]>([])
const isActive = ref(false)

// 可拖拽元素在放置区域中时
const onHandleDragOver = (e: DragEvent) => {
  console.log(e);
}

// 可拖拽元素进入放置区域
const onHandleDragEnter = (e: DragEvent) => {
  isActive.value = true
}

// 可拖拽元素离开放置区域
const onHandleDragLeave = (e: DragEvent) => {
  isActive.value = false
}

// 松手将文件放入放置区域时
const onHandleDrop = (e: DragEvent) => {
  // 需要阻止事件默认行为，不然文件会直接在浏览器中打开
  e.preventDefault()
  // 只要将文件拖拽进入放置区域，文件会自动保存在事件对象中
  // 是一个类数组，可以支持多个文件放置，若同时将多个文件拽入放置区域那就是多个元素
  if (e.dataTransfer?.files) {
    console.log(e.dataTransfer.files);
    for (let file of e.dataTransfer.files) {
      fileList.push(file)
    }
  }
  isActive.value = false
}

watch(() => fileList.length, () => {
  console.log(fileList);

})

</script>

<style scoped lang='scss'>
.upload_container {
  padding: 10px;

  .drop_container {
    height: 120px;
    width: 200px;
    user-select: none;
    border: 1px dotted dodgerblue;

    &.active {
      border-color: red;
    }
  }
}
</style>