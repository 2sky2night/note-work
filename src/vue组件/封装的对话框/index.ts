import Dialog from './index.vue'
import { h, render } from 'vue'
import './index.css'

/**
 * 打开弹窗
 * @param start 弹窗出现的位置
 */
function dialog (start: { x: number, y: number }) {

  const container = document.createElement('div')
  container.classList.add('dialog-mask')

  const vnode = h(Dialog, {
    start,
    onToClose () {
      setTimeout(() => {
        container.remove()
      },500)
    }
  })

  render(vnode, container)

  document.body.insertAdjacentElement('beforeend', container)

}

export default dialog