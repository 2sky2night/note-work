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

​	由于插槽里面的内容默认情况下都是直接渲染出来的。但是我们只需要渲染carousel-item列表组件，所以我们可以在通过slot接受到插槽内容后，适用v-if禁止默认插槽的渲染。我们需要手动渲染接受到的插槽就可以使用我们的神**component 动态组件**，来实现手动渲染。过滤出来carousel-item组件列表之后，需要展示只需要v-for列表渲染component动态组件并传入对应的组件虚拟DOM即可完成手动渲染内容。

​	**不过下面这种过滤的方式不支持v-for指令渲染，指令渲染时需要额外进行处理。**

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

​	由于通过v-for指令渲染时，会创建一个虚拟DOM，然后把列表渲染的内容作为该虚拟DOM的子孩子，此时就需要单独的进行判断了。

​	可以看到v-for渲染时，v-for的虚拟DOM实例的type为symbol，symbol可以转换成字符串，我们转换成字符串比对即可知晓本次渲染是通过模板渲染还是v-for指令渲染了，v-for指令渲染时，去查看他的子孩子列表，若子孩子虚拟DOM的名称为carousel-item，则保存即可。

**模板渲染时，插槽接受到的内容:**

![01](C:\Users\Admin\Desktop\fold\note\img\01.png)

**v-for指令渲染时，插槽接受到的内容：**

​	若使用了多个v-for指令，只会创建多个外层虚拟DOM，其子孩子就是对应渲染的列表。

![02](C:\Users\Admin\Desktop\fold\note\img\02.png)

![03](C:\Users\Admin\Desktop\fold\note\img\03.png)

**最后**

```vue
<template>
  <div class="carousel-container" :style="{ height: height + 'px' }">
    <div class="carousel-box" :style="{ left: `-${ currentIndex * 100 }%` }">
      <component v-for="( item, index ) in carouselList" :key="index" :is="item" />
    </div>
    <div class="dots-container">
      <CarouselDot v-model="currentIndex" :index="index" v-for="( item, index ) in carouselList" :key="index" />
    </div>
  </div>
  <slot v-if="false"></slot>
</template>

<script lang='ts' setup>
// 组件
import CarouselDot from './components/CarouselDot.vue'
// hooks
import { ref } from 'vue'

//当前显示的轮播图索引
const currentIndex = ref(0)
// 轮播图的自定义属性
const props = defineProps<{ height: number }>()
// 定义插槽
const slots = defineSlots<{ default: () => any }>()
// 获取默认插槽的内容
const defaultsList = slots.default()

const carouselList = defaultsList.reduce((list: any, ele: any) => {
  if (ele.type.name === 'CarouselItem') {
    // 若是模板渲染的子项且组件名称为CarouselItem就保留
    list.push(ele)
    return list
  } else if ((ele.type as Symbol).toString() === 'Symbol(v-fgt)') {
    // 若是通过v-for指令渲染的 则需要获取所有渲染的子内容并使用组件名是否为Carouselitme的筛选
    ele.children.filter((son: any) => son.type.name === 'CarouselItem').forEach((item: any) => list.push(item))
    return list
  }
}, [])

console.log('轮播项列表：', carouselList)

defineOptions({
  name: 'Carousel'
})

</script>

<style scoped lang='scss'>
.carousel-container {
  overflow: hidden;
  position: relative;

  .carousel-box {
    display: flex;
    position: absolute;
    left: 0;
    transition: .3s;
    width: 100%;
    height: 100%;
    z-index: 100;
  }

  .dots-container {
    position: absolute;
    width: 100%;
    display: flex;
    z-index: 101;
    bottom: 10px;
    justify-content: center;
  }

}
</style>


```

**4.不使用carousel-item组件渲染轮播图项**

​	也就是carousel组件默认插槽直接传入对应原生标签，以一个标签对应一个轮播项，只需要在carousel组件中进行处理即可。