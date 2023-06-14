封装轮播图Carousel组件

​	一般看到的Carousel组件都为一个Carousel父组件包裹n个carousel-item组件。

```vue
<Carousel :height="180">
  <CarouselItem>1</CarouselItem>
  <CarouselItem>2</CarouselItem>
</Carousel>
```

​	一个carousel-item组件代表一个轮播项，要在Carousel组件传入内容就需要先声明一个默认插槽，供给使用者来声明轮播项列表，同时carousel-item组件也需要提供一个默认插槽来代表该轮播项里面的内容。

**1.过滤Carousel组件默认插槽的其他内容**

​	Carousel组件提供的默认插槽可以让使用者传入各式各样的DOM元素或组件，但是我们只以carousel-item组件为一个轮播项，所以需要过滤掉不需要渲染的内容，我们只需要接受carousel-item组件，其他内容都不需要渲染，所以需要获取到需要渲染的carousel-item组件列表。

​	defineSlots返回值为一个对象，对象中某个成员代表一个插槽，成员值为一个函数，调用即可获取到对应插槽里面的内容，这个内容其实是一个虚拟DOM，虚拟DOM是可以通过component组件来渲染的。

```ts
// Carousel组件的script部分

// 自定义属性
const props = defineProps<{ height: number }>()
// 定义插槽
const slots = defineSlots<{ default: () => any }>()
// 获取默认插槽的内容，以CarouselItem为一个轮播项，过滤出需要渲染的carouselItem组件列表，ele.type.name为组件的名称，我们只需要过滤出carouse-item组件实例即可，其他内容都不需要。
const defaultsList = slots.default().filter((ele: any) =>
  ele.type.name === "CarouselItem")

console.log(defaultsList)

defineOptions({
  name: 'Carousel'
})

```

**2.carousel-item组件的代码**

​	仅仅提供了一个默认插槽，供使用者传入轮播项的内容。

```vue
<template>
  <div class="carousel-item">
    <slot></slot>
  </div>
</template>

<script lang='ts' setup>
defineOptions({
  name:'CarouselItem'
})
</script>

<style scoped lang='scss'>
.carousel-item{

}
</style>
```

**3.渲染过滤出来的carousel-item组件列表**

​	由于插槽里面的内容默认情况下都是直接渲染出来的。但是我们只需要渲染carousel-item列表组件，所以我们可以在通过slot接受到插槽内容后，适用v-if禁止默认插槽的渲染。我们需要手动渲染接受到的插槽就可以使用我们的神**component 动态组件**，来实现手动渲染。过滤出来carousel-item组件列表之后，需要展示只需要v-for列表渲染component动态组件并传入对应的组件虚拟DOM即可完成手动渲染内容。不过下面这种过滤的方式不支持v-for指令渲染，指令渲染时需要额外进行处理。

```vue
<template>
  <div class="carousel-container" :style="{ height: height + 'px' }">
    <slot v-if="false"></slot>
    <component v-for="( item, index ) in defaultsList" :key="index" :is="item" />
  </div>
</template>

<script lang='ts' setup>

// 自定义属性
const props = defineProps<{ height: number }>()
// 定义插槽
const slots = defineSlots<{ default: () => any }>()
// 获取默认插槽的内容，以CarouselItem为一个轮播项
const defaultsList = slots.default().filter((ele: any) =>
  ele.type.name === "CarouselItem")

console.log(defaultsList)

defineOptions({
  name: 'Carousel'
})
</script>

<style scoped lang='scss'>
.carousel-container {
  width: 100%;
}
</style>
```

