export interface WaterFullOptions {
  /**
   * 那个元素需要被控制为瀑布流
   */
  el: HTMLElement;
  /**
   * 瀑布流要几列
   */
  column: number;
  /**
   * 每一项的间隔多少px
   */
  gap: number;
}


/**
 * 瀑布流解决方案（不通用(主要是图片高度影响偏移量的高度)，但是基础思路差不多）
 */
export default class WaterfullResovle {
  /**
   * 那个元素需要被控制为瀑布流
   */
  readonly el: HTMLElement;
  /**
   * 瀑布流要几列
   */
  readonly column: number;
  /**
   * 每一项的间隔多少px
   */
  readonly gap: number;
  /**
   * 每一列的高度
   */
  columnHeighs: number[];
  /**
   * 每一列的高度
   */
  columnWidth: number;
  constructor (options: WaterFullOptions) {
    this.gap = options.gap;
    this.column = options.column;
    this.el = options.el;
    if (!(this.el instanceof HTMLElement)) {
      new Error('WaterfullResovle实例必须控制一个DOM元素')
    }
    // 初始化每一列的高度
    this.columnHeighs = Array.from<number>({ length: this.column }).fill(0);
    // 记录每一列的宽度 如何计算？（主视图容器宽度-每一列的间距）/列数 
    this.columnWidth = (this.el.clientWidth - (this.column - 1) * this.gap) / this.column
    this.init()
  }
  init () {
    this.el.style.position = 'relative'
    // 获取所有子项

    const children = Array.from(this.el.children) as HTMLElement[];

    // 统一设置子项的宽度
    children.forEach(ele => {
      // 设置当前子项布局为绝对定位
      ele.style.position = 'absolute'
      // 设置每个子项（每列）的宽度,如何计算？（主视图容器宽度-每一列的间距）/列数 
      ele.style.width = `${ this.columnWidth }px`
    })

    // 初始化渲染
    children.length && this.renderOk()
  }
  /**
   * 假瀑布流
   */
  async render () {
    // 获取所有子项
    const children = Array.from(this.el.children) as HTMLElement[];
    // 当前是第几列,0为第一列
    let currentColumn = 0;

    for (let i = 0; i < children.length; i++) {
      const ele = children[ i ]

      // 1.设置偏移量
      // 1.1设置top
      // 1获取当前列的高度
      const itemHeigh = this.columnHeighs[ currentColumn ];
      // 2设置当前子项的高度
      // 这里假设子项有一个img图片
      // 如果我们需要记录子项的高度的话，必须要等待img图片加载完成才能获取当前子项正确的高度
      await new Promise<void>((r) => {
        const img = ele.querySelector('img') as HTMLImageElement
        // img.complete适用与某些已经缓存过的图片，也就是已经加载过的图片
        if (img.complete) {
          r()
        } else {
          // onload适用与新图片加载完成
          img.onload = () => {
            r()
          }
        }

      })

      ele.style.top = itemHeigh + 'px'

      // 3更新当前列的高度
      this.columnHeighs[ currentColumn ] = itemHeigh + ele.clientHeight + this.gap;

      // 2.设置left
      if (currentColumn === 0) {
        // 若当前为第一列
        ele.style.left = '0px'
      } else {
        // 非第一列 则偏移量为前一个的偏移量+前一个的宽度+gap
        ele.style.left = `${ +children[ currentColumn - 1 ].style.left.split('px')[ 0 ] + children[ currentColumn - 1 ].clientWidth + this.gap }px`;
      }
      currentColumn++
      // 等于当前列了，需要重置列数
      if (currentColumn === this.column) {
        currentColumn = 0
      }
    }

  }
  /**
   * 真瀑布流
   */
  async renderOk () {
    // 获取所有子项
    const children = Array.from(this.el.children) as HTMLElement[];

    // 遍历所有子项
    for (let i = 0; i < children.length;) {
      const ele = children[ i ]
      if (i < this.column) {
        // 当前为第一行 则直接设置当前行子项的偏移量
        const img = ele.querySelector('img') as HTMLImageElement
        // 检查图片是否需要加载
        if (!img.complete) {
          // 若当前图片需要加载
          await new Promise<void>(r => {
            // 图片加载完成的回调
            img.onload = () => {
              r()
            }
          })
        }
        // 设置当前子项的top值
        ele.style.top = '0px'
        // 记录当前列的高度
        this.columnHeighs[ i ] = ele.clientHeight + this.gap
        // 设置当前子项的left值
        ele.style.left = `${ (this.columnWidth + this.gap) * i }px`;
        i++
      } else {
        // 非第一行

        // 根据当前所有列高度升序排序
        const mapColumnList = this.columnHeighs.map((ele, index) => {
          return { height: ele, column: index }
        }).sort((a, b) => a.height - b.height)
        console.log(mapColumnList);

        for (let j = 0; j < mapColumnList.length; j++) {
          // 当前行的某一列子项
          const currentEle = children[ i + j ]
          const img = currentEle.querySelector('img') as HTMLImageElement
          // 检查图片是否需要加载
          if (!img.complete) {
            // 若当前图片需要加载
            await new Promise<void>(r => {
              // 图片加载完成的回调
              img.onload = () => {
                r()
              }
            })
          }
          // 设置子项top
          currentEle.style.top = mapColumnList[ j ].height + 'px'
          // 设置当前列的高度
          this.columnHeighs[ mapColumnList[ j ].column ] += currentEle.clientHeight + this.gap
          // 设置当前子项的left (需要通过当前插入的第几列来设置left偏移量)
          currentEle.style.left = (this.columnWidth + this.gap) * mapColumnList[ j ].column + 'px'
        }

        // 每次遍历都会设置列个子项，所以下次遍历需要跳过当前行
        i = i + this.column
      }
    }
  }
}

/**
 * 解决思路
 * 1.每一列布局？
 * 通过获取控制的元素宽度-所有列的间隔/列数即可
 * 2.如何设置每个子项的位置？
 * 容器设置为相对定位，子元素全部设置为绝对定位，使用偏移量给每个子元素布局
 * 当超过这一行时，需要往下一行插入子元素
 * 2.1如何判断当前子项所处的行数
 * 遍历时就通过一个变量来计数，超过column就说明换行，然后置为第一行
 * 2.2如何计算每个子元素的偏移量
 * 高度：通过保存每一列的高度即可完成（通过当前子项的高度top+子项自身的高度+间距）
 * 宽度：通过获取当前子项的前一个子项的left+前一个子项自身的宽度+间距即可确定
 * -----------前面为简易版的瀑布流，只是看起来像，但是不满足每一行的第一个元素(以数组索引顺序)必须插入在上一行中高度最矮的一列，第二个元素必须是上一行中高度第二矮的一列，以此类推...--------------
 * 3.如何实现每一行第一个子项必须插入到上一行元素中高度最低的一列呢？
 * 需要判断上一行中，高度最矮的一行，把当前第一行元素的需要插入到该行中
 * 然后再看倒数第二矮的，然后把第二行插入到该行中，直至该行全部插入完成
 * 
 */