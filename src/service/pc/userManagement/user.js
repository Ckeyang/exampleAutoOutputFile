import { doPost, doGet, doDelete, doPut } from '../../../axiosconfig/index.js';
let userService = {
  getUserList: (params) => doGet('/app/users', params),
  getRoolList: (params) => doGet('/app/roles', params),
  createUser: (params) => doPost('/app/users', params),
  deleteUser: (id) => doDelete('/app/users/', id),
  updateUser: (id, params) => doPut('/app/users/' + id, params),
  createRool: (params) => doPost('/app/roles', params),
  getRoolById: (id) => doGet(`/app/roles/${id}`, {}),
  deleteRool: (id) => doDelete('/app/roles/', id),
  updateRool: (id, params) => doPut('/app/roles/' + id, params),
  getDepartmentTree: (params) => doGet('/app/departments', params),
  createDepartment: (params) => doPost('/app/departments', params),
  deleteDepartment: (id) => doDelete('/app/departments/', id),
  updateDepartment: (id, params) => doPut('/app/departments/' + id, params),
  getLoginUser: (params) => doGet('/app/users/customerInfo', params),
  getMechanism: (id) => doGet('/app/customers/' + id, {}),
  updatePassword: (params) => doPost('/app/users/password', params),
  // 查询用户显示列配置
  getUserDisplaySortTableHead: (params) => doGet('/app/user/personalized/staticTable/displayAndSort', params),
  // 设置用户显示列配置
  setUserDisplaySortTableHead: (params) => doPost('/app/user/personalized/staticTable/displayAndSort', params),
  // 查询搜索选项
  getAllDataByControlId: (params) => doGet('/app/user/personalized/staticTable/filterValue', params),
};
export default userService;
