一、封装轮播图Carousel组件

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

![01](https://github.com/2sky2night/note-work/blob/master/img/01.png?raw=true)

**v-for指令渲染时，插槽接受到的内容：**

​	若使用了多个v-for指令，只会创建多个外层虚拟DOM，其子孩子就是对应渲染的列表。

![02](https://github.com/2sky2night/note-work/blob/master/img/02.png?raw=true)

![03](https://github.com/2sky2night/note-work/blob/master/img/03.png?raw=true)

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

**5.实现末尾两张的平滑切换**

​	依旧使用老套路，在列表的前面和后面加上最后一项和第一个轮播项，此时列表为n+2个，临界值为1和n。虽然有点bug，不过算了。

​	完成：

```vue
<template>
  <div class="carousel-container" :style="{ height: height + 'px' }">
    <div class="carousel-box" :style="{ left: `-${ currentIndex * 100 }%`, transition: `${ tsTime }s` }">

      <component :is="carouselList[ carouselList.length - 1 ]"></component>
      <component v-for="(        item, index        ) in carouselList" :key="index" :is="item" />
      <component :is="carouselList[ 0 ]"></component>

    </div>
    <div v-if="showDots" class="dots-container">
      <CarouselDot v-model="currentIndex" :index="item" v-for="            item             in carouselList.length"
        :key="item" />
    </div>
    <div class="carousel-btns" v-if="showBtns">
      <div class="carousel-btn" @click="throttlePre">&lt;</div>
      <div class="carousel-btn" @click="throttleNext">></div>
    </div>
  </div>
  <slot v-if="false"></slot>
</template>

<script lang='ts' setup>
// 组件
import CarouselDot from './components/CarouselDot.vue'
// hooks
import { ref, onMounted, nextTick, watch } from 'vue'
import throttle from '@/utils/tools/throttle'

//当前显示的轮播图索引
// 1--- carousel.length为轮播项的范围，0是追加到最前面的最后一项  carousel.length+1为追加到最后面的第一项
const currentIndex = ref(1)
// 轮播图的自定义属性
const props = defineProps<{
  /**
   * 高
   */
  height: number;
  /**
   * 是否显示指示器
   */
  showDots: boolean;
  /**
   * 是否显示上下轮播项按钮
   */
  showBtns: boolean;
  /**
   * 是否自动播放
   */
  autoplay: boolean;
  /**
   * 自动播放的延迟时间
   */
  delay: number;
}>()
// 定义插槽
const slots = defineSlots<{ default: () => any }>()
// 获取默认插槽的内容
const defaultsList = slots.default()
// 轮播图的过渡时间
const tsTime = ref<.3 | 0>(.3)
console.log(defaultsList)
// 要渲染的轮播项
const carouselList: any[] = defaultsList.reduce((list: any, ele: any) => {
  if (ele.type.name === 'CarouselItem') {
    // 若是模板渲染的子项且组件名称为CarouselItem就保留
    list.push(ele)
    return list
  } else if (typeof ele.type === "symbol" && ele.type.toString() === 'Symbol(v-fgt)') {
    // 若是通过v-for指令渲染的ele.type则是一个symbol类型 则需要获取所有渲染的子内容并使用组件名是否为Carouselitme的筛选
    ele.children.filter((son: any) => son.type.name === 'CarouselItem').forEach((item: any) => list.push(item))
    return list
  } else {
    // 若为其他内容则不需要渲染
    return list
  }
}, [])


// console.log('轮播项列表：', carouselList)

/**
 * 上一张
 */
function onHandlePre () {
  if (currentIndex.value == 1) {
    // 1为临界值 需要特殊处理
    // 先让其正常滑动到 0 也就是展示最后一项
    currentIndex.value--
    // 当页面更新后
    nextTick(() => {
      // 延迟300ms是因为轮播图动画是三秒 当动画执行完成时也就是移动到正常范围-1处了，也就是重复的最后一项。我们需要设置过渡时间为0，好让改变left时没有动画效果，然后立即移动到正常范围的最后一项。
      setTimeout(() => {
        tsTime.value = 0;
        currentIndex.value = carouselList.length
        // 当移动到最后一项后需要让过渡时间恢复 但是必须要用延迟器，而且必须要设置时间为动画效果的时间??(存疑)，否则也会被同步更新，会导致移动到正常范围的最后一项会出现动画效果。
        nextTick(() => {
          setTimeout(() => {
            tsTime.value = .3
          }, 150)
        })
      }, 300)

    })
  } else {
    currentIndex.value--
  }
}

/**
 * 下一张
 */
function onHandleNext () {
  if (currentIndex.value === carouselList.length) {
    // 若当前是正常范围的最后一项 需要另做处理
    currentIndex.value++
    nextTick(() => {
      // 调整过渡时间 立即跳转到正常范围中的第一项
      setTimeout(() => {
        tsTime.value = 0;
        currentIndex.value = 1;
        // 恢复过渡时间
        nextTick(() => {
          setTimeout(() => {
            tsTime.value = .3
          }, 150)
        })
      }, 300)
    })
  } else {
    currentIndex.value++
  }
}

const throttleNext = throttle(onHandleNext, 500)
const throttlePre = throttle(onHandlePre, 500)

// 是否自动播放？
if (props.autoplay) {
  onMounted(() => {
    setInterval(() => {
      throttleNext()
    }, props.delay)
  })
}


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
    width: 100%;
    height: 100%;
    z-index: 100;
  }

  .dots-container {
    background-image: linear-gradient(to top, #0000002d, #00000000);
    position: absolute;
    width: 100%;
    display: flex;
    z-index: 102;
    bottom: 0px;
    height: 35px;
    align-items: center;
    justify-content: center;
  }

  .carousel-btns {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 101;
    display: flex;
    align-items: center;

    .carousel-btn {
      pointer-events: all;
      position: absolute;
      font-size: 18px;
      cursor: pointer;
      height: 25px;
      width: 25px;
      text-align: center;
      background-color: var(--dot-not-acitve-color);
      line-height: 25px;
      border-radius: 50%;
      color: #fff;
      transition: .3s;

      &:hover {
        background-color: var(--dot-acitve-color);

      }

      &:first-child {
        left: 10px;
      }

      &:last-child {
        right: 10px
      }
    }
  }

}
</style>
```

二、声明ref获取到的组件实例类型

​	有时候自己定义的组件，在使用时，通过ref想要获取到组件实例读取组件暴露出来的属性，但是想要定义组件实例的类型却不知道无从下手，就会导致ts推论错误。

​	其实组件实例的属性和你defineExpose时传入的参数是一样的，你暴露出了那些属性，在通过ref获取到组件实例时，组件实例上的属性和defineExpose传入的参数是一致的。

​	defineExpose也可以传入泛型达到编译时声明暴露的成员，所以只需要定义defineExpose的类型即可实现定义组件实例的类型。在外部使用时，引入该类型即可完成对ref类型的声明。

