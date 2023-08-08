interface Options {
  /**
   * 那个元素需要控制为瀑布流
   */
  el: HTMLElement;
  /**
   * 列数
   */
  columnCount: number;
  /**
   * 间距
   */
  gap: number;
}

interface WaterFallProps {
  /**
 * 那个元素需要控制为瀑布流
 */
  readonly $el: HTMLElement;
  /**
   * 列数
   */
  readonly columnCount: number;
  /**
   * 间距
   */
  readonly gap: number;
  /**
   * 每列的高度
   */
  columnsHeight: number[];
  /**
 * 当前渲染到第几项了
 */
  currentIndex: number;
}

class WaterFallResolve implements WaterFallProps {
  /**
* 那个元素需要控制为瀑布流
*/
  readonly $el: HTMLElement;
  /**
   * 列数
   */
  readonly columnCount: number;
  /**
   * 间距
   */
  readonly gap: number;
  /**
   * 每列的高度
   */
  columnsHeight: number[];
  /**
   * 当前渲染到第几项了
   */
  currentIndex: number;
  /**
   * 每个子项的宽度
   */
  itemWidth: number;
  constructor (options: Options) {
    if (!(options.el instanceof HTMLElement)) {
      new Error('视图必须控制一个DOM元素')
    }
    this.$el = options.el
    this.columnCount = options.columnCount
    this.gap = options.gap
    this.columnsHeight = Array.from<number>({ length: this.columnCount }).fill(0)
    this.$el.style.position = 'relative'
    this.currentIndex = 0;
    // 设置每一列的宽度为 剩余空间/列数
    this.itemWidth = (this.$el.clientWidth - this.gap * (this.columnCount - 1)) / this.columnCount
    this.$el.children.length && this.render()

  }
  async renderOK () {
    // 遍历每一个元素，给每一个元素设置偏移量和设置宽度
    for (let i = 0; i < this.$el.children.length;) {
      if (i < this.columnCount) {
        // 处理第一行
        const ele = this.$el.children[ i ] as HTMLElement
        ele.style.position = 'absolute'
        ele.style.width = `${ this.itemWidth }px`
        // 设置top
        ele.style.top = '0px'
        // 设置left
        ele.style.left = `${ (this.itemWidth + this.gap) * i }px`
        // 获取子项中图片元素，来设置每列高度

        const img = ele.querySelector('img') as HTMLImageElement
        if (img.complete) {
          // 图片已经加载完成了
          console.log('图片缓存加载完成');
          this.columnsHeight[ i ] += ele.clientHeight + this.gap
        } else {
          // 图片未加载完成(假定未加载完成时，loading控件高度为100px);
          this.columnsHeight[ i ] += 100 + this.gap;
          img.onload = () => {
            console.log('图片加载完成');
            // 由于图片加载完成了，高度会发生变化，所以需要重新计算当前列的偏移量

          }
        }
        i++
      } else {
        // 非第一行(每次遍历都处理一行的子项)

        // 需要获取当前根据升序排序后的列高度，用来确定当前行子项们插入的位置
        const orderHeights = this.columnsHeight.map((ele, index) => ({ column: index, height: ele })).sort((a, b) => a.height - b.height)

        // 遍历来插入到对应列中
        orderHeights.forEach((col, index) => {
          const ele = this.$el.children[ i + index ] as HTMLElement
          ele.style.position = 'absolute'
          // 设置top
          ele.style.top = `${ col.height }px`
          // 设置left
          ele.style.left = `${ (this.itemWidth + this.gap) * col.column }px`
          // 更新当前列的高度
          // 获取子项中图片元素，来设置每列高度
          const img = ele.querySelector('img') as HTMLImageElement
          if (img.complete) {
            this.columnsHeight[ col.column ] += ele.clientHeight + this.gap
          } else {
            // 图片未加载完成 （假定未加载完成时，loading控件高度为100px）
            this.columnsHeight[ col.column ] += 100 + this.gap
            img.onload = () => {
              console.log('图片加载完成');
              // 由于图片加载完成了，高度会发生变化，所以需要重新计算当前列的偏移量

            }
          }
        })

        i = i + this.columnCount

      }
    }
  }
  async render () {
    // 遍历每一个元素，给每一个元素设置偏移量和设置宽度
    console.log(this.currentIndex);

    for (let i = this.currentIndex; i < this.$el.children.length; this.currentIndex = i) {
      if (i < this.columnCount) {
        // 处理第一行
        const ele = this.$el.children[ i ] as HTMLElement
        ele.style.position = 'absolute'
        ele.style.width = `${ this.itemWidth }px`
        // 设置top
        ele.style.top = '0px'
        // 设置left
        ele.style.left = `${ (this.itemWidth + this.gap) * i }px`
        // 获取子项中图片元素，来设置每列高度
        const img = ele.querySelector('img') as HTMLImageElement
        // 获取图片的url
        const url = img.dataset.url as string
        const image = new Image()
        // 加载图片
        image.src = url
        if (!image.complete) {
          await new Promise<void>(r => {
            image.onload = () => r()
          })
        }
        // 加载完成设置图片元素的src
        img.src = url

        // 更新当前列的高度
        this.columnsHeight[ i ] += ele.clientHeight + this.gap
        i++
      } else {
        // 非第一行(每次遍历都处理一行的子项)

        // 需要获取当前根据升序排序后的列高度，用来确定当前行子项们插入的位置
        const orderHeights = this.columnsHeight.map((ele, index) => ({ column: index, height: ele })).sort((a, b) => a.height - b.height)

        // 遍历来插入到对应列中
        for (let index = 0; index < orderHeights.length; index++) {
          const col = orderHeights[ index ]
          const ele = this.$el.children[ i + index ] as HTMLElement
          console.log(ele);

          if (ele === undefined) break;
          ele.style.position = 'absolute'
          ele.style.width = `${ this.itemWidth }px`
          // 设置top
          ele.style.top = `${ col.height }px`
          // 设置left
          ele.style.left = `${ (this.itemWidth + this.gap) * col.column }px`
          // 获取子项中图片元素，来设置每列高度
          const img = ele.querySelector('img') as HTMLImageElement
          // 获取图片的url
          const url = img.dataset.url as string
          const image = new Image()
          // 加载图片
          image.src = url
          if (!image.complete) {
            await new Promise<void>(r => {
              image.onload = () => r()
            })
          }
          // 加载完成设置图片元素的src
          img.src = url
          // 更新当前列的高度
          this.columnsHeight[ col.column ] += ele.clientHeight + this.gap;
          i++
        }

      }
    }
  }
}

export default WaterFallResolve