import { doGet } from '../../axiosconfig/index.js'
let indexService = {
  // 获取代办事项
  getWaitWorks: params => doGet('/app/homepage/todo/items')

}
export default indexService
