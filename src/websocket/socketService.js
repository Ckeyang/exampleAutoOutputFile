import socketService from '../utils/socket'
import { generalWsMessage, getTaskPool, getTaskLockScreen } from './pipe/project'
import { userInfo } from './pipe/user'
import Bus from '@/views/common/bus'

// let timer = null;
let num = 0
// timer = setInterval(() => {
//   let token = sessionStorage.token;
//   if (token) {
//     connect();
//     window.clearInterval(timer);
//     timer = null;
//   }
// }, 1000);
let socket = socketService.createClient('/backend/endpoint')
function connect() {
  socket.connect(function(test) {
    userInfo.bind(this.client)()
    generalWsMessage.bind(this.client)()
    getTaskPool.bind(this.client)()
    getTaskLockScreen.bind(this.client)()
    if (num < 10) {
      num++
      this.client.ws.onerror = function() {
        console.log('重连' + num)
        setTimeout(() => {
          connect()
        }, 1000)
      }
      this.client.ws.onclose = function() {
        console.log('重连' + num)
        setTimeout(() => {
          connect()
        }, 1000)
      }
    }
  })
}
if (sessionStorage.token) {
  connect()
}
try {
  window.addEventListener('message', function(e) {
    if (e.data === 'login') {
      connect()
    } else if (e.data === 'loginout') {
      socket.removeClient()
    }
  })
} catch (e) {
  Bus.$on('login', () => {
    connect()
  })
  Bus.$on('loginout', () => {
    socket.removeClient()
  })
}
