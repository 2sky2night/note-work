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

三、scss样式穿透

```scss
    ::v-deep .arco-btn{
      pointer-events: all;
    }
```

四、数据库并发解决方案

```ts
const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql2/promise');

const app = new Koa();
const router = new Router();

// 建立连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
});

// 定义一个路由处理函数，该函数会开启一个事务，并更新一条数据，同时使用乐观锁进行并发控制
router.post('/update', async (ctx, next) => {
  const id = ctx.request.body.id;
  const newValue = ctx.request.body.newValue;

  // 开启事务
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    // 查询当前数据的版本号和值
    const [rows, _] = await conn.query('SELECT value, version FROM mytable WHERE id = ? FOR UPDATE', [id]);

    if (!rows.length) {
      throw new Error(`Data with id=${id} does not exist`);
    }

    // 检查版本号是否匹配，若不匹配则表示数据已被修改过
    const { value, version } = rows[0];
    if (version !== ctx.request.body.version) {
      throw new Error(`Data with id=${id} has been modified by others`);
    }

    // 更新数据并增加版本号
    await conn.query('UPDATE mytable SET value = ?, version = version + 1 WHERE id = ?', [newValue, id]);

    // 提交事务
    await conn.commit();

    ctx.body = {
      success: true,
      message: `Data with id=${id} has been updated successfully`,
    };
  } catch (err) {
    // 回滚事务
    await conn.rollback();

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: err.message,
    };
  } finally {
    // 释放数据库连接
    conn.release();
  }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);

```

### 五、vue项目使用i18n插件

navigator.language这个BOM API可以获取当前浏览器的语言

#### 1.配置i18n插件

​	需要先安装vue-i18n插件，创建locale文件夹，创建index文件，引入后配置i18n插件，同时需要准备各个国家的翻译文案。导出i18n对象后，可以直接使用app.use注册插件，就可以在模板中使用该插件提供的api实现多语言文本替换了。

```ts
import { createI18n } from 'vue-i18n';
// 提前准备好的各个国家的翻译文案
import CN from './CN';
import US from './US';
import BR from './BR';
import ID from './ID';
import JP from './JP';
import RU from './RU';
import TH from './TH';
import VN from './VN';
import NG from './NG';

const i18n = createI18n({ 
    // 当前激活的国家文本 （value必须是messages配置项中的某个key）
    locale: 'CN', 
    // 失败激活的国家文本（value必须是messages配置项中的某个key）
    fallbackLocale: 'US',
    allowComposition: true,
    // 配置各个国家的文本
    messages: {
        CN,
        US,
        BR,
        ID,
        JP,
        RU,
        TH,
        VN,
        NG
    }
});
  
export default i18n;
```

#### 2.配置某个国家的文案

​	形如这种对象形式的来配置各个文本

// CN.ts

```ts
import layout from './CN/layout'
export default {
  layout,
  message: {
    hello:'你好'
  }
}
```

// 模块化举例 layout.ts

```ts
export default {
  header: {
    signIn: '登录',
    signUp: '注册',
    home: '首页',
    game:'游戏'
  },
}
```

#### 3.在模板中使用

​	通过app.use安装好了该插件就可以直接在模板中使用其提供的$t方法，来通过2中配置的对象路径来读取对应的文案。

```vue
<template>
  <div class="sign-container">
    <div class="mr-10 sign-in-btn btn">{{ $t('layout.header.signIn') }}</div>
    <div class="sign-up-btn btn">{{ $t('layout.header.signUp') }}</div>
  </div>
</template>
```

#### 4.在ts中使用

 	引入创建的i18n实例即可使用提供的api，i18n.global.t()，读取对象路径获取对应的值。

 ```ts
<script lang='ts' setup>
import NavBtn from '@/components/btn/NavBtn.vue';
import i18n from '@/locale' // 引入i8n实例

const list = [
  { icon: 'icon-home', title: i18n.global.t('layout.header.home'), path: '/' },
  { icon: 'icon-live-broadcast', title: i18n.global.t('layout.header.game'), path: '/game' },
]
</script>
 ```

#### 5.切换当前语言设置

​	该钩子可以获取到i18n实例，i18n.locale.value即可设置语言，但是必须是实例化i18n时messages配置项中有的key才能生效。

```ts
import { useI18n } from 'vue-i18n'
// i18n插件
const i18n = useI18n()
function setLanguage (value: LOCALE_VALUE_TYPE) {
  i18n.locale.value = value
}
```

​	所有模板内容调用了$t函数都会重新解析模板生成对应语言的dom文本

![01](https://github.com/2sky2night/note-work/blob/master/img/05.png?raw=true)

​	**但是通过ts调用t函数是不会因为语言更新而重新调用 这个需要特别注意（也就是4的例子）。**，这种方式生成的内容都是死内容，需要自己手动监听语言的变化，重新调用t函数生成对应语言文本。

![01](https://github.com/2sky2night/note-work/blob/master/img/04.png?raw=true)

#### 6.多语言路由表渲染导航菜单处理

​	最开始我是直接在路由上直接调用t函数根据语言模式生成对应文本，这样生成的路由表是文本内容是死的，有两种解决方案

###### 1.getter函数（代码量多一些）

​	所以可以配置一个getter函数，getter函数调用后返回当前语言的路由表。

##### routes.ts

```ts
import type { RouteRecordRaw } from 'vue-router';
import i18n from '@/locale';

export const initRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: i18n.global.t('menu.home'),
      icon: 'icon-folder',
      level: 1
    }
  },
  {
    path: '/sports',
    name: 'sports',
    component: () => import('@/views/sports/index.vue'),
    meta: {
      title: i18n.global.t('menu.sports'),
      icon: 'icon-at',
      level: 1
    }
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/views/game/index.vue'),
    meta: {
      title: i18n.global.t('menu.game'),
      icon: 'icon-code',
      level: 1
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      title: 'test',
      icon: 'icon-folder',
      level: 1
    },
    children: [
      {
        path: '/test/test-son-01',
        name: 'test-son-01',
        component: () => import('@/views/test/children/test-son-01/index.vue'),
        meta: {
          title: 'test-son-01',
          icon: 'icon-folder',
          level: 2
        },
        children: [
          {
            path: '/test/test-son-01/test-son-01-son-01',
            name: 'test-son-01-son-01',
            component: () => import('@/views/test/children/test-son-01/children/test-son-01-son-01/index.vue'),
            meta: {
              title: 'test-son-01-son-01',
              icon: 'icon-folder',
              level: 3
            },
          },
          {
            path: '/test/test-son-01/test-son-01-son-02',
            name: 'test-son-01-son-02',
            component: () => import('@/views/test/children/test-son-01/children/test-son-01-son-02/index.vue'),
            meta: {
              title: 'test-son-01-son-02',
              icon: 'icon-folder',
              level: 3
            },
          },
        ]
      },
      {
        path: '/test/test-son-02',
        name: 'test-son-02',
        component: () => import('@/views/test/children/test-son-02/index.vue'),
        meta: {
          title: 'test-son-02',
          icon: 'icon-folder',
          level: 2
        },
        children: [
          {
            
            path: '/test/test-son-02/test-son-02-son-01',
            name: 'test-son-02-son-01',
            component: () => import('@/views/test/children/test-son-02/children/test-son-02-son-01/index.vue'),
            meta: {
              title: 'test-son-02-son-01',
              icon: 'icon-folder',
              level: 3
            },
          },
          {
            path: '/test/test-son-02/test-son-02-son-02',
            name: 'test-son-02-son-02',
            component: () => import('@/views/test/children/test-son-02/children/test-son-02-son-02/index.vue'),
            meta: {
              title: 'test-son-02-son-02',
              icon: 'icon-folder',
              level: 3
            },
          },
        ]
      }
    ]
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/blog/index.vue'),
    meta: {
      title: i18n.global.t('menu.blog'),
      icon: 'icon-launch',
      level: 1
    }
  },
]

/**
 * 获取路由表
 * @returns 
 */
export const getterInitRoutes = () => {
  return [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: i18n.global.t('menu.home'),
        icon: 'icon-folder',
        level: 1
      }
    },
    {
      path: '/sports',
      name: 'sports',
      component: () => import('@/views/sports/index.vue'),
      meta: {
        title: i18n.global.t('menu.sports'),
        icon: 'icon-at',
        level: 1
      }
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/game/index.vue'),
      meta: {
        title: i18n.global.t('menu.game'),
        icon: 'icon-code',
        level: 1
      }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/test/index.vue'),
      meta: {
        title: 'test',
        icon: 'icon-folder',
        level: 1
      },
      children: [
        {
          path: '/test/test-son-01',
          name: 'test-son-01',
          component: () => import('@/views/test/children/test-son-01/index.vue'),
          meta: {
            title: 'test-son-01',
            icon: 'icon-folder',
            level: 2
          },
          children: [
            {
              path: '/test/test-son-01/test-son-01-son-01',
              name: 'test-son-01-son-01',
              component: () => import('@/views/test/children/test-son-01/children/test-son-01-son-01/index.vue'),
              meta: {
                title: 'test-son-01-son-01',
                icon: 'icon-folder',
                level: 3
              },
            },
            {
              path: '/test/test-son-01/test-son-01-son-02',
              name: 'test-son-01-son-02',
              component: () => import('@/views/test/children/test-son-01/children/test-son-01-son-02/index.vue'),
              meta: {
                title: 'test-son-01-son-02',
                icon: 'icon-folder',
                level: 3
              },
            },
          ]
        },
        {
          path: '/test/test-son-02',
          name: 'test-son-02',
          component: () => import('@/views/test/children/test-son-02/index.vue'),
          meta: {
            title: 'test-son-02',
            icon: 'icon-folder',
            level: 2
          },
          children: [
            {
              
              path: '/test/test-son-02/test-son-02-son-01',
              name: 'test-son-02-son-01',
              component: () => import('@/views/test/children/test-son-02/children/test-son-02-son-01/index.vue'),
              meta: {
                title: 'test-son-02-son-01',
                icon: 'icon-folder',
                level: 3
              },
            },
            {
              path: '/test/test-son-02/test-son-02-son-02',
              name: 'test-son-02-son-02',
              component: () => import('@/views/test/children/test-son-02/children/test-son-02-son-02/index.vue'),
              meta: {
                title: 'test-son-02-son-02',
                icon: 'icon-folder',
                level: 3
              },
            },
          ]
        }
      ]
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/blog/index.vue'),
      meta: {
        title: i18n.global.t('menu.blog'),
        icon: 'icon-launch',
        level: 1
      }
    },
  ]
}
```

##### 使用

```vue
<template>
  <div class="navigations-container">
    <a-menu :selected-keys="[ $route.path ]">
      <NavigateItems :routes="routesList" />
    </a-menu>
  </div>
</template>

<script lang='ts' setup>
// 路由表
import { getterInitRoutes } from '@/router/routes';
// 组件
import NavigateItems from './NavigateItems.vue';
// hooks
import { useRoute } from 'vue-router';
import useSettingStore from '@/store/setting';
import { watch,reactive } from 'vue';
import { storeToRefs } from 'pinia';
// types
import type { RouteRecordRaw } from 'vue-router';

// 设置仓库
const settingStore = useSettingStore()
// 当前语言
const { language } = storeToRefs(settingStore)
// 路由
const $route = useRoute()
// 路由表
const routesList: RouteRecordRaw[] = reactive([])

// 语言变化时 需要重新根据语言来获取最新的路由表
watch(language, () => {
  routesList.length = 0
  getterInitRoutes().forEach(ele => {
    routesList.push(ele)
  })
},{immediate:true})

</script>

<style scoped lang='scss'>
.navigations-container {
  flex-grow: 1;
}
</style>
```

2.使用computed函数

​	利用i18n.global.t函数在语言切换时会重新调用一次的特性，可以使用computed函数，传入getter函数，getter函数直接返回路由表，这样就能做到语言切换时重新调用getter函数，相当于底层就是1的实现，但是简化了监听的流程，让vue监听到t函数执行直接调用getter函数获取最新的路由表。

定义

```ts
/**
 * 获取路由表
 * @returns 
 */
export const getterInitRoutes = computed(() => {
  return [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: i18n.global.t('menu.home'),
        icon: 'icon-folder',
        level: 1
      }
    },
    {
      path: '/sports',
      name: 'sports',
      component: () => import('@/views/sports/index.vue'),
      meta: {
        title: i18n.global.t('menu.sports'),
        icon: 'icon-at',
        level: 1
      }
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/game/index.vue'),
      meta: {
        title: i18n.global.t('menu.game'),
        icon: 'icon-code',
        level: 1
      }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/test/index.vue'),
      meta: {
        title: 'test',
        icon: 'icon-folder',
        level: 1
      },
      children: [
        {
          path: '/test/test-son-01',
          name: 'test-son-01',
          component: () => import('@/views/test/children/test-son-01/index.vue'),
          meta: {
            title: 'test-son-01',
            icon: 'icon-folder',
            level: 2
          },
          children: [
            {
              path: '/test/test-son-01/test-son-01-son-01',
              name: 'test-son-01-son-01',
              component: () => import('@/views/test/children/test-son-01/children/test-son-01-son-01/index.vue'),
              meta: {
                title: 'test-son-01-son-01',
                icon: 'icon-folder',
                level: 3
              },
            },
            {
              path: '/test/test-son-01/test-son-01-son-02',
              name: 'test-son-01-son-02',
              component: () => import('@/views/test/children/test-son-01/children/test-son-01-son-02/index.vue'),
              meta: {
                title: 'test-son-01-son-02',
                icon: 'icon-folder',
                level: 3
              },
            },
          ]
        },
        {
          path: '/test/test-son-02',
          name: 'test-son-02',
          component: () => import('@/views/test/children/test-son-02/index.vue'),
          meta: {
            title: 'test-son-02',
            icon: 'icon-folder',
            level: 2
          },
          children: [
            {
              
              path: '/test/test-son-02/test-son-02-son-01',
              name: 'test-son-02-son-01',
              component: () => import('@/views/test/children/test-son-02/children/test-son-02-son-01/index.vue'),
              meta: {
                title: 'test-son-02-son-01',
                icon: 'icon-folder',
                level: 3
              },
            },
            {
              path: '/test/test-son-02/test-son-02-son-02',
              name: 'test-son-02-son-02',
              component: () => import('@/views/test/children/test-son-02/children/test-son-02-son-02/index.vue'),
              meta: {
                title: 'test-son-02-son-02',
                icon: 'icon-folder',
                level: 3
              },
            },
          ]
        }
      ]
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/blog/index.vue'),
      meta: {
        title: i18n.global.t('menu.blog'),
        icon: 'icon-launch',
        level: 1
      }
    },
  ]
})
```

使用

```ts
<template>
  <div class="navigations-container">
    <a-menu :selected-keys="[ $route.path ]">
      <NavigateItems :routes="getterInitRoutes" />
    </a-menu>
  </div>
</template>

<script lang='ts' setup>
// 路由表
import { getterInitRoutes } from '@/router/routes';
// 组件
import NavigateItems from './NavigateItems.vue';
// hooks
import { useRoute } from 'vue-router';
// 路由
const $route = useRoute()

</script>

<style scoped lang='scss'>
.navigations-container {
  flex-grow: 1;
}
</style>
```

#### 7.渲染动态内容

​	例如要渲染 确定删除xx吗？的国际化

定义：

```ts
en:{
    deleteTip:'Are you sure to delete {username}'
},
cn:{
    deleteTip:'你确定要删除 {username} 吗'
}
```

使用

```ts
$t('deleteTip',{username:'张三'})
```

8.多语言面包屑

```ts
<template>
  <div class="breadcrumb-container">
    <a-breadcrumb>
      <a-breadcrumb-item @click="() => onHandleClick(item.path)" v-for="item in list" :key="item.path">
        {{ item.title }}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script lang='ts' setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router';
import { getterInitRoutes } from '@/router/routes';

const router = useRouter()
const route = useRoute()
const list = computed(() => {
  // 当前激活的路由
  const nowRoutes = route.matched
  // 遍历当前激活的路由表 获取对应的title
  return nowRoutes.map(ele => {
    return {
      path: ele.path,
      title:getRouteTitle(ele.path,getterInitRoutes.value)
    }
  })
})

// 根据当前路由的path获取对应的title
function getRouteTitle (path: string, routes: RouteRecordRaw[]):string {
  let title = ''
  // 遍历当前层级的路由 获取对应的title
  if(routes.some(ele => {
    if (ele.path === path) {
      if (ele.meta) {
        title = ele.meta.title
      } else {
        title = ele.path
      }
      return true
    }
  })) {
    // 若找到了则直接返回对应title
    return title
  } else {

    // 若没找到就遍历当前层的每一级路由，递归调用对应子路由
    for (let i = 0; i < routes.length; i++){
      // 若有子孩子就递归调用 没有就跳过调用递归函数
      if (routes[ i ].children) {
        const res = getRouteTitle(path, routes[ i ].children as RouteRecordRaw[])
        // 若找到了 并且不为not found（因为第一次调用可能未找到则返回值为not found，但后续子路由还没开始找呢） 没找到则直接跳过，遍历下一个路由
        if (res&&res!=='not found') {
          return res
        }
      }
    }

    // 兜底的 若遍历一直没找到就是not found
    return 'not found'
  }
}

const onHandleClick = (path: string) => {
  router.push(path)
}

defineOptions({
  name: 'Breadcrumbs'
})
</script>

```

六、模态框

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-container" v-if="isShowModal" @click="handleCloseModal">
        <Transition name="content" appear>
          <div @click.stop="" class="content" v-if="isShow">
            <slot name="default"></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang='ts' setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  /**
   * 模态框是否显示
   */
  modelValue: boolean
}>()
const emit = defineEmits<{
  /**
   * 
   */
  'update:modelValue': [ value: boolean ]
  /**
   * 模态框关闭的事件
   */
  'close': []
}>()
defineSlots<{
  default: () => any
}>()

// 是否显示主要内容
const isShow = ref(true)
const isShowModal = ref(false)
// 当前是否还在执行关闭的动画效果？
let time: null | number = null

/**
 * 点击遮罩层的回调
 */
const handleCloseModal = () => {
  isShow.value = false;
  // 动画效果执行完毕时 销毁模态框
  nextTick(() => {
    time=setTimeout(() => {
      isShowModal.value = false
      emit('update:modelValue', false)
      emit('close')
      time=null
    }, 300)
  })
}

// 保持一致
watch(() => props.modelValue, (v) => {
  if (time) {
    // 非常重要
    // 若当前还有在挂起的延时器 则关闭延时器 避免数据源混乱
    clearTimeout(time)
  }
  if (!v) {
    // 关闭模态框
    handleCloseModal()
  } else {
    isShowModal.value = v
    isShow.value = v
  }
}, { immediate: true })
defineOptions({ name: 'Modal' })
</script>

<style scoped lang='scss'>
.modal-container {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--color-mask-bg);
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    background-color: var(--color-bg-1);
    min-height: 100px;
    min-width: 100px;
  }

  .content-enter-active {
    animation: contentMove .3s 1 ease-in-out;
  }

  .content-leave-active {
    animation: contentMove .3s 1 ease-in-out reverse;
  }

  @keyframes contentMove {
    from {
      opacity: 0;
      transform: scale(.7);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }
}
</style>
```



https://juejin.cn/post/7151950058501373989 vue+tsx



https://blog.csdn.net/weixin_43972992/article/details/124755426 全局注册的组件配置ts类型支持

[全局组件类型声明的最佳实践 (Vue3+TS+Volar) - 掘金 (juejin.cn)](https://juejin.cn/post/7066730414626308103)

七、封装鉴权按钮组件

​	页面中有很多按钮都需要用户登录才能使用的，如果给每个按钮的点击事件添加判断登录的逻辑多少有点繁琐，所以就想自己封装一个鉴权组件（最开始想用自定义指令实现的，奈何自定义指令没办法捕获点击事件）。

​	原理：鉴权按钮组件其实没有按钮，通过slots传入对应的按钮组件，外层一个div容器，当点击插槽中的内容时，事件触发会从html根元素开始捕获，会经过外层的div，最后到达插槽里面的元素，我们可以通过事件捕获机制来拦截到此次点击事件，并执行对应鉴权逻辑，最后（最关键的是）通过stopImmediatePropagation，停止事件捕获，也就是说停止浏览器向里面寻找事件触发的元素，和停止事件冒泡一个逻辑，只是方向不一样，冒泡是从里到外，捕获是从外到内。

```vue
<template>
  <div @click.capture="(e)=>onHandleClick(e)" class="auth-btn-container">
    <slot name="default"></slot>
  </div>
</template>

<script lang='ts' setup>
// hooks
import useUserStore from '@/store/user';
import { useMessage } from 'naive-ui';
// types
import type { VNode } from 'vue';
// configs
import tips from '@/config/tips';

const message = useMessage()
const userStore = useUserStore()

/**
 * 点击的该容器的回调 在捕获时触发
 */
const onHandleClick =  (e:Event) => {
  if (userStore.isLogin) {
    message.success('用户登录了')
  } else {
    message.warning('未登录')
    // 停止事件捕获 阻止继续事件捕获
    e.stopImmediatePropagation()
  }
}

defineSlots<{
  default:()=>VNode[]
}>()
</script>
```

