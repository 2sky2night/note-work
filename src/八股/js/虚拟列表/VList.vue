<template>
  <div class="container" @scroll="onHandleScroll" ref="container">
    <div class="list" :style="{ height: scrollHeightCSS, paddingTop: `${ itemCount * itemHeight }px` }">
      <div class="item" v-for="item in _list">{{ item.data }}</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'
// 主视图500px，子项50px，一页展示10个
// 每个子项高度
const itemHeight = 50;
const itemHeightCSS = `${ itemHeight }px`;
// 子项个数
const itemLength = 100000
// 容器总高度
const scrollHeight = itemHeight * itemLength
const scrollHeightCSS = `${ scrollHeight }px`
// 列表
const list = Array.from({ length: itemLength }).map((_, index) => {
  return {
    index: index + 1,
    data: '你好' + (index + 1)
  }
})
// 当前卷上去多少项了
const itemCount = ref(0)
// 主视图
const container = ref()
// 需要展示的列表
const _list = computed(() => {
  return list.slice(itemCount.value, itemCount.value + 10)
})
const onHandleScroll = () => {
  const target = container.value as HTMLDivElement
  // 计算出当前卷上去多少项了
  itemCount.value = Math.floor(target.scrollTop / itemHeight)
}

</script>

<style scoped lang='scss'>
.container {
  margin: 50px;
  height: 500px;
  border: 1px solid #eee;
  overflow-y: auto;

  .list {
    // 注意将padding设置为内容区，否则list高度会越变越大
    box-sizing: border-box;
    .item {
      height: v-bind(itemHeightCSS);
    }
  }
}
</style>