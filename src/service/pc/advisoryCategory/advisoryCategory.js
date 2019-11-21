import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';
let advisoryCategoryService = {
  // 获取类别树
  getAdvisoryCategoryTree: (params) => doGet('/app/businessCategory/findCategoryTree', params),
  //新增类别
  addCategory: (params) => doPost('/app/businessCategory', params),
  //修改类型
  editCategory: (id, params) => doPut(`/app/businessCategory/${id}`, params),
  //修改状态(停用、启用)
  editCategoryState: (id, params) => doPut(`/app/businessCategory/changeState/${id}`, params),
  //删除节点
  deleteCategoryNode: (id) => doDelete(`/app/businessCategory/${id}`)
};
export default advisoryCategoryService;
