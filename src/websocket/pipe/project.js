import { Notification } from 'element-ui'
import Bus from '@/views/common/bus'
// 消息通知通道
function generalWsMessage() {
  console.log('generalWsMessage 链接')
  this.subscribe('/user/topic/generalWsMessage.my', function(res) {
    let data = JSON.parse(res.body)
    // console.log('我是generalWsMessage：', data)
    Notification({
      title: '提示',
      dangerouslyUseHTMLString: true,
      message: `<p>${data.message.info}</p>`
    })
    Bus.$emit('webSocket', data) // 触发消息事件订阅回调
  })
}
// 任务池通道
function getTaskPool() {
  this.subscribe('/user/topic/taskPool.my', function(res) {
    let data = JSON.parse(res.body)
    Bus.$emit('ws_getTaskPool', data) // 触发任务池事件订阅回调
  })
}
// 锁屏通道
function getTaskLockScreen() {
  this.subscribe('/user/topic/taskLockScreen.my', function(res) {
    let data = JSON.parse(res.body)
    Bus.$emit('ws_getTaskLockScreen', data) // 触发锁屏事件订阅回调，更新当前操作进度
  })
}

export { generalWsMessage, getTaskPool, getTaskLockScreen }
