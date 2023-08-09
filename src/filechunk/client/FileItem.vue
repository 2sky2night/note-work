<template>
  <div class="file-item" @click="onHandleDownload">
    <div class="ext-view" :title="`${ ext }文件`" :class="className">
      {{ ext&&ext.toLocaleUpperCase() }}
    </div>
    <span class="file-name">{{ name }}</span>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue'

interface ItemProps {
  origin_name: string;
  size: number;
  name: string;
  ext: string;
}

const props = defineProps<ItemProps>()
const className = computed(() => {
  return {
    [ `file-type-${ props.ext }` ]: true
  }
})
// 下载文件
const onHandleDownload = async () => {
  const res = confirm('确定下载?')
  if (res) {
    // const a = document.createElement('a')
    // a.href = 'http://127.0.0.1:3000/download?fileName=' + props.origin_name
    // a.click()
    const res = await new Promise<{ url: string; size: number }>(r => {
      const xhr = new XMLHttpRequest()
      xhr.open('get', 'http://127.0.0.1:3000/download?fileName=' + props.origin_name)
      xhr.send()
      xhr.onload = (ev) => {
        // @ts-ignore
        r(JSON.parse(ev.target.response))
      }
    })
    const file = new Blob([ res.url ])
    const ah = document.createElement('a')
    ah.download = props.origin_name
    ah.href = window.URL.createObjectURL(file)
    ah.click()
    URL.revokeObjectURL(ah.href)
  }
}
</script>

<style scoped lang='scss'>
.file-item {
  padding: 10px;
  width: 100px;
  text-align: center;
  user-select: none;
  transition: .3s;
  border: 1px solid #eee;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #eeeeee;
  }

  .ext-view {
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-size: 30px;
    font-weight: 600;

    &.file-type-ts {
      color: #0069a1;
    }

    &.file-type-vue {
      color: #3c9974;
    }

    &.file-type-js {
      color: #ffab00;
    }

    &.file-type-txt {
      color: #000;
    }

    &.file-type-html {
      color: #d94a26;
    }

    &.file-type-css {
      color: #42a5f5;
    }

    &.file-type-scss {
      color: #dd4b78;
    }
    &.file-type-zip {
      color: #c34ce0;
    }
    &.file-type-png {
      color: #4c7be0;
    }
  }

  .file-name {
    display: inline-block;
    color: #aaa;
    width: 100px;
    overflow: hidden;
    word-break: keep-all;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
}
</style>