import { ref } from 'vue'

export type CallBack = (isIntersecting:boolean) => void

export default function (ele: HTMLElement, cb: CallBack) {
  const isInner = ref(false)

  const observer = new IntersectionObserver(([ entry ]) => {

    
    if (entry.isIntersecting) {
      // 产生交集了
      isInner.value = true
    } else {
      // 未产生交集
      isInner.value = false
    }
    // 回调触发调用传入的回调
    cb(isInner.value)
  })

  // 监听元素与容器的是否相交
  observer.observe(ele)

  const stop = () => {
    observer.unobserve(ele)
    observer.disconnect()
  }


  return {
    stop
  }

}