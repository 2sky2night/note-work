/**
 * 非单例的PubSub
 */
export class Pubsub {
  private channels: {
    [propsName: string]: Function[]
  }
  constructor() {
    this.channels = {}
  }
  /**
   * 发布消息
   * @param token 消息id 
   * @param args 消息发出时的参数
   */
  emit(token: string, ...args: any[]) {
    const channel = Reflect.get(this.channels, token)
    if (channel === undefined) {
      // 没有该频道，创建该频道
      this.channels[token] = []
    } else {
      // 有该频道，通知所有订阅者
      channel.forEach(cb => cb(...args))
    }
  }
  /**
   * 订阅频道
   * @param token 频道id
   * @param cb 频道更新后的回调
   */
  on(token: string, cb: Function) {
    const channel = Reflect.get(this.channels, token)
    if (channel === undefined) {
      // 无该频道 创建频道，并添加订阅者
      this.channels[token] = [cb]
    } else {
      // 保存订阅者的回调
      channel.push(cb)
    }
  }
  /**
   * 移除订阅
   * @param token 频道id 
   * @param cb 回调
   */
  remove(token: string, cb: Function) {
    const channel = Reflect.get(this.channels, token)
    if (channel) {
      const index = channel.findIndex(ele => ele === cb)
      channel.splice(index, 1)
    } else {
      throw new Error('无该频道:' + token)
    }
  }
  // 移除频道
  // 清空订阅者
}

export default new Pubsub()