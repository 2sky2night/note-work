import pubsub from './index'

function fun() {
  console.log('11');
}


pubsub.on('message', fun)
pubsub.remove('message',fun)
pubsub.emit('message', 'gun')