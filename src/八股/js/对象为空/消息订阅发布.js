function PubSub () {

  // 频道列表
  const list = []

  /**
   * 消息订阅
   * @param {string} id 消息id
   * @param {function} cb 消息发布时要执行的回调
   * @example
   * subscribe('msg',()=>{
   *  console.log("Hello")
   * })
   */
  const subscribe = (id, cb) => {
    // 查询该频道
    const item = list.find(ele => ele.id === id)
    if (item) {
      // 有该频道，关注该频道
      item.cbList.push(cb)
    } else {
      // 注册频道，并关注
      list.push({
        id,
        cbList: [ cb ]
      })
    }
  }

  /**
   * 消息发布
   * @param {string} id 消息id
   * @param  {...any} args 消息发布时注入的参数
   * @example 
   * public('msg')
   */
  const public = (id, ...args) => {
    // 查询该频道
    const item = list.find(ele => ele.id === id)
    if (item) {
      item.cbList.forEach(cb => {
        cb(id, ...args)
      })
    } else {
      console.warn('no one subscribe this channel...')
    }

  }

  return {
    public,
    subscribe
  }
}

const { subscribe, public } = PubSub()

const person = {
  name: 'Mark',
  year: 12
}

subscribe('nameChange', (id, name) => {
  console.log('名字更新了!',name);
})

subscribe('nameChange', (id, name) => {
  console.log('人信息更新了!',name);
})

setTimeout(() => {
  person.name = 'Wang wu'
  public('nameChange',person.name)
}, 3000)

