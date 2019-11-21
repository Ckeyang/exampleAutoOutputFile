import { doGet, doPut } from '../../../axiosconfig/index.js';
 // 系统参数
let systemParamsService = {
  findListByEnum: (params) => doGet('/app/shareComponent/findListByEnum', params), // 根据id获取系统参数字段
};
export default systemParamsService;