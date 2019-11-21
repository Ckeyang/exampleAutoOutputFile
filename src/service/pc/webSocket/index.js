import { doGet, doPut } from '../../../axiosconfig/index.js'
let websocketService = {
  // 获取消息列表
  getWebSocketInfoList: params => doGet('/app/webSocket/infoList', params),
  // 标记为已读消息
  readInfo: (id, type) => doPut(`/app/webSocket/${id}/${type}`)

}
export default websocketService
