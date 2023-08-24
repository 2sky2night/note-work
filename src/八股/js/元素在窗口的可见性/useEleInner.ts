import { ref } from 'vue'

export default function (element: HTMLElement, cb: (flag: boolean) => void) {
  const isInner = ref(false)

  const observe = () => {
    if (element.offsetTop <= document.documentElement.scrollTop + window.innerHeight) {
      // 元素距离文档高度小于等于视口高度+卷上去的高度
      if (document.documentElement.scrollTop >= element.offsetTop + element.clientHeight) {
        // 若卷上去的高度大于等于元素距离文档的y坐标+自身高度 则离开窗口了
        isInner.value = false
      } else {
        isInner.value = true
      }
    } else {
      // 元素距离文档高度大于视口高度+卷上去的高度
      isInner.value = false
    }
    cb(isInner.value)
  }

  const stop = () => {
    window.removeEventListener('scroll', observe)
  }


  observe()
  window.addEventListener('scroll', observe)

  return {
    isInner,
    stop
  }
}