import { createApp, render, h } from 'vue';
import { styled } from '@styils/vue'
import type { Component, VNode } from 'vue';
import './index.css'

// 容器
const container = document.createElement('div')
container.classList.add('message_container')
// 实例个数
let insCount = 0

// message template element
const component = {
  Container: styled('div', {
    backgroundColor: '#fff',
    padding: '5px 20px',
    height: '30px',
    boxShadow: '0 0 10px #eee',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center'
  })
}

/**
 * message component
 */
const MessageBox: Component<{ title: string }> = {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  emits: [ 'release' ],
  mounted () {
    // 三秒后销毁组件
    setTimeout(() => {
      this.$emit('release')
    }, 3000)
  },
  render (ctx: any) {
    const { Container } = component
    return (
      <Container>
        <span>{ ctx.title }</span>
      </Container>
    )
  }
}

// 销毁实例的回调
const onHandleRelease = async (ins: VNode) => {
  const parent = (ins.el as HTMLElement)?.parentElement
  if (parent) {
    // 添加离场动画
    parent.classList.add('message_item_leave')
    // 延迟三秒钟
    await setTimeOutAsync(300)
    // 移出父元素
    parent.remove()
    insCount--
    if (insCount === 0) {
      // 若无实例了，需要卸载容器
      container.remove()
    }
  }

}

export default function (title: string) {
  // 若无消息实例就渲染容器
  if (insCount === 0) {
    // 渲染容器
    document.body.appendChild(container)
  }
  // 渲染消息实例
  const itemContainer = document.createElement('div')
  itemContainer.classList.add('message_item')
  // 创建消息实例
  const messageIns = h(MessageBox, {
    title,
    onRelease: () => onHandleRelease(messageIns)
  })
  // 渲染实例
  render(messageIns, itemContainer)
  container.appendChild(itemContainer)
  // 添加进场动画
  itemContainer.classList.add('message_item_enter')
  insCount++
  // 删除进场动画
  setTimeout(() => {
    itemContainer.classList.remove('message_item_enter')
  }, 300)
}

function setTimeOutAsync (delay: number) {
  return new Promise<void>(r => {
    setTimeout(() => {
      r()
    }, delay)
  })
}