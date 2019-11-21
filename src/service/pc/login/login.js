import { doPost, doGet, doPut } from '../../../axiosconfig/index.js';

let loginService = {
  login: (params) =>
    doPost(
      '/app/users/authenticate?userAccount=' +
        params.userAccount +
        '&password=' +
        params.password,
      params
    ),
  getverificationCode: (params) => doGet('/app/users/authenticate/sms/code', params),
  shortMessageLogin: (params) => doPost('/app/users/authenticate?userAccount=' + params.userAccount + '&password=' + params.code, params),
  resetPassword: (params) => doPost('/app/users/authenticate/reset/password', params),
  checkUser: (params) => doPost('/app/users/authenticate/reset/check?userAccount=' + params.userAccount + '&code=' + params.code, params),
  logout: (params) => doPost('/app/users/logout', params),
  // 新增试用账户
  addTrialAccount: (params) => doPost('/app/users/authenticate/trial', params),
  // 新增正式账户
  addFormalAccount: (params) => doPost('app/users/authenticate/customer', params),
  // 企业机构信息查重
  checkRepeat: (params) => doGet('/app/users/authenticate/info/validation', params),
  // 检查手机号是否重复
  checkPhoneIsRepeat: (params) => doGet('/app/users/authenticate/mobilePhoneNumber/check', params)
};

export default loginService;
