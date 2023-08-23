/**
 *   <div class="app">
    <span>{{msg}}</span>
    <button @click="onHandleClck">点我试试响应式</button>
    <div>{{num}}</div>
    <div>{{num}}</div>
    <div>{{num}}</div>
    </div>
 */
/**
 * Vue实例
 */
class Vue {
  /**
   * @param {{el:HTMLElement,data:any,methods:any}} options
  **/
  constructor ({ data, el, methods }) {
    this.el = el
    this.data = data
    this.methods = methods
    // 保存html模板
    this.template = this.el.innerHTML
    // 解析模板
    this.templateParse(Array.from(this.el.childNodes))
    // 配置数据的劫持
    this.initData()
    // 配置方法
    this.initMethods()
    // 给模板元素绑定方法
    this.initDOMMethods(Array.from(this.el.children))
    this.version=0.001
    console.log(this);
  }
  /**
   * 配置方法劫持
   * */
  initMethods () {
    Object.entries(this.methods).forEach(([ key, method ]) => {
      if (method.__proto__ === Function.prototype) {
        this[ key ] = method.bind(this)
      }
    })
  }
  /**
   * 给模板元素绑定方法
   * @param {HTMLElement[]} children
   * */
  initDOMMethods (children) {
    children.forEach(ele => {
      ele.getAttributeNames().forEach(attr => {
        const value = ele.getAttribute(attr)
        if (attr.substring(0, 1) === '@') {
          // 若属性名的第一个为@，则为事件绑定指令
          const eventName = attr.substring(1)
          if (this[ value ] === undefined) {
            console.warn('options.methods has not this method:' + value);
          } else {
            // 绑定事件
            ele.addEventListener(eventName, this[ value ])
          }
          // 移除该属性
          ele.removeAttribute(attr)
        }
      })
      // if (ele.hasAttribute('@click')) {
      //   // 若元素有这个@click属性 则为其绑定method
      //   const methodName = ele.getAttribute('@click')
      //   if (this[ methodName ] === undefined) {
      //     // 没有该方法
      //     console.log('no this method called:' + methodName);
      //   } else {
      //     // 存在该方法，则给元素绑定事件
      //     ele.addEventListener('click', this[ methodName ])
      //   }
      //   // 删除该属性
      //   ele.removeAttribute('@click')
      //   ele.getAttribute('@click')
      // }
    })
  }
  /**
  * 配置数据劫持
  * */
  initData () {
    Reflect.ownKeys(this.data).forEach(key => {
      // 给每个data配置get和set
      Object.defineProperty(this, key, {
        get () {
          return this.data[ key ]
        },
        set (value) {
          this.data[ key ] = value
          // 初始化模板的内容，重新渲染模板,也就是说，只要更新一个元素，DOM全部都重新创建
          this.el.innerHTML = this.template
          this.templateParse(Array.from(this.el.childNodes))
          // 给模板元素绑定方法
          this.initDOMMethods(Array.from(this.el.children))
        }
      })
    })
  }
  /**
   * 解析模板,遍历每个节点修改节点的文本内容
   * 不太行，考虑的情况太片面
   * 1.解析的文本只能全匹配插值表达式才行，有空格都不行
   * 2.只能搞浅层的，属性值必须全是普通数据类型
   * @param {HTMLElement[]} children
   */
  templateParse (children) {
    children.forEach(ele => {
      if (ele.nodeType === 1) {
        // 若元素为标签
        if (ele.childNodes.length) {
          // 若有子元素就递归解析
          this.templateParse(Array.from(ele.childNodes))
        }
      } else if (ele.nodeType === 3) {
        //文本节点
        const key = this.textCheck(ele.textContent)
        if (key !== null) {
          //  插值语法匹配上了
          ele.textContent = this.data[ key ]
        }
      }

    })
  }
  /**
   * 检查文本内容是否匹配data的key以及插值表达式
   * */
  textCheck (text) {
    let currentKey = null
    Object.keys(this.data).some(key => {
      if (`{{${ key }}}` === text) {
        currentKey = key
        return true
      }
    })
    return currentKey
  }
}