import type { Directive } from 'vue';
import './index.css'

// 取消预览的事件回调 
// 因为同一时间预览只会预览一个，所以只需要保存这一个回调即可，滚动条事件触发就执行回调
let handle: null | Function = null
window.addEventListener('scroll', () => {
  handle && handle()
})
window.addEventListener('resize', () => {
  handle && handle()
})


export default {
  /**
   * 1.深拷贝目标元素，做为预览
   * 2.创建遮罩层作为预览时的容器，将元素放到遮罩层中去
   * 3.给目标元素绑定点击事件，点击显示容器，并通过css隐藏自身
   * 4.给遮罩层绑定点击事件，点击时移除容器
   * 5.通过预览时的唯一性，来保存一个移除时的回调，在滚动事件和拉伸事件时取消预览
   * @param el 
   */
  mounted (el) {

    // 克隆当前元素
    const elCopy = el.cloneNode(true) as HTMLElement
    // 遮罩层
    const maskContainer = document.createElement('div')
    maskContainer.classList.add('mask-container')
    // 创建遮罩层，让元素成为为遮罩层的子元素
    maskContainer.appendChild(elCopy)


    // 点击遮罩层取消预览的事件回调
    const onHandleClick = (e?: Event) => {
      if (e && e.target === elCopy) {
        // 若时点击的目标元素，停止冒泡
        return
      }
      // 执行时将全局的置空(重要)
      handle = null
      // 添加离场动画
      elCopy.classList.add('leave')
      setTimeout(() => {
        // 动画执行完后移除立场动画
        elCopy.classList.remove('leave')
        maskContainer.remove()
        el.style.visibility = 'visible'
      }, 300)
    }

    // 点击遮罩层取消预览,恢复目标元素的样式
    maskContainer.addEventListener('click', onHandleClick)

    // 点击事件的回调 并隐藏当前元素
    el.addEventListener('click', () => {
      // 将点击遮罩层取消预览的事件保存到全局
      handle = onHandleClick
      // 获取目标元素距离视口的位置
      const { top, left } = el.getBoundingClientRect()
      // 给容器（给克隆元素也行）挂载当前元素距离视口位置的属性 (最关键的地方)
      maskContainer.style.setProperty('--top', `${ top }px`)
      maskContainer.style.setProperty('--left', `${ left }px`)
      // 设置子元素的绝对定位，配合动画
      elCopy.style.position = 'absolute'
      // 给子元素加入入场动画
      elCopy.classList.add('enter')
      setTimeout(() => {
        // 动画结束后删除入场动画
        elCopy.classList.remove('enter')
      }, 300)
      el.style.visibility = 'hidden'
      document.body.appendChild(maskContainer)
    })

  }
} as Directive<HTMLElement, undefined>