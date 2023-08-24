import { ref } from 'vue'

export default function (ele: HTMLElement, cb: Function) {
  const isInner = ref(false)

  /**
  * y轴上边完全不可见，通过bottom<=0
  * y轴底部完全不可见，通过top===window.innerHeight
  */
  /**
   * x轴左边完全不可见,right<=0
   * x轴右边完全不可见left>=window.innerWidth
   */

  const onHandleScroll = () => {
    const data = ele.getBoundingClientRect()
    // y
    if (data.bottom <= 0 || data.top >= window.innerHeight) {
      // 顶部完全不可见 和 底部不可见
      isInner.value = false
      cb(isInner.value)
      return
    }
    // x
    if (data.left >= window.innerWidth || data.right <= 0) {
      // 右侧完全不可见 和 左侧不可见
      isInner.value = false
      cb(isInner.value)
      return
    }
    isInner.value = true
    cb(isInner.value)
  }

  const start = () => {
    onHandleScroll()
    window.addEventListener('scroll', onHandleScroll)
    window.addEventListener('resize', onHandleScroll)

  }
  const stop = () => {
    window.removeEventListener('scroll', onHandleScroll)
    window.removeEventListener('resize', onHandleScroll)
  }
  start()
  return {
    start,
    stop,
    isInner
  }
}