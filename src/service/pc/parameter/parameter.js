import { doGet, doPut, doPost } from '../../../axiosconfig/index.js';
let paramterService = {
  // 获取所有的检测类别
  getAllInspectionCategory: (params) => doGet('/app/categoryManage/findCategoryListByParentId', params),
  // 获取限值规定列表
  getRestrictiveRulesList: (params) => doGet('/app/limitRegulation', params),
  // 根据类别获取限值规定表单
  getRestrictiveFormList: (limitValueCategory, evaluationCategory, params) => doPost(`/app/limitRegulation/${limitValueCategory}/${evaluationCategory}/list`, params),
  // 保存检测类别的绑定
  editLimitRegulation: (params, id) => doPut(`/app/limitRegulation/${id}`, params),
  //获取因素列表
  getDiathisiList: (params) => doGet('/app/factor', params),
  //根据检测类型获取物质类型
  getSubstanceCategoryList: (params) => doGet('/app/limitRegulation/findByDetectionCategoryId', params),
  //根据物质id查看物质详情
  getSubstanceDetails: (params) => doGet(`/app/factor/${params}`, '')
};
export default paramterService;
