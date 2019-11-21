import {
  doGet,
  doPost,
  doPut,
  doDelete
} from '../../../axiosconfig/index.js';
let formEnterService = {
  //获取所有组件分类列表
  getComponentKind: (params) => doGet('app/forms/findTreeFormByProjectId/', params),
  //获取录入表格结构和数据（优化接口）
  getFormData: (params) => doPost('app/forms/findSimpleFormAndData', params),
  // 预览时的组件树查询
  getComponentPreviewTree: (id) => doGet(`/app/forms/findTreeFormByPreviewId/${id}`),
  getComponentHistoryList: (params) => doGet(`/app/forms/findControlValue`, params),
  //通过id获取子组件数据
  getChildByParentId: (id, params) => doGet(`app/forms/findFormByParentId/${id}`, params),
  //通过当前行id和自己的id获取组件数据，结构
  findFormDataByDataIdAndControlId: (params) => doGet('app/forms/findFormDataByDataIdAndControlId', params),
  //通过parentId查询游离的数据
  findAllSubDatas: (params) => doPost('app/forms/findAllSubDatas', params),
  //复制数据
  copyData: (id, dataId, params) => doPost(`/app/forms/data/${id}/copy?dataId=${dataId}`, params),
  //引用数据
  associatedData: (params) => doPost('app/forms/quoteData', params),
  //取消引用
  disConnectQuoteData: (params) => doPost('/app/forms/disConnectQuoteData', params),
  //保存数据
  saveData: (params) => doPost('app/forms', params),
  //查询数据
  getCurData: (params) => doGet('app/forms/findFormDataByParentId/', params),
  //删除数据
  deleteCurData: (params) => doDelete('app/forms', params),
  //修改数据
  editCurData: (param1, param2) => doPut('app/forms/', param1, param2),
  //移除预览所生成的表单
  deletePreviewForm: (params) => doDelete('app/templates/preview/delete/', params),
  //获取组件下面的数据条数
  getCoustomDataNum: (params) => doGet('app/forms/findSizeByDataIdAndControlId', params),
  //查询项目下有几条冲突
  getProjectConflictNum: (params) => doGet('app/forms/findProectAllConflict/', params),
  //提交录入数据内容
  postFormValues: (params) => doPut('app/project/update/state', params),
  //修改涉及按钮
  editSwatch: (param1, param2, params3) => doPut('app/forms/involved/' + param1 + '/' + param2 + '/' + params3),
  //打印表单
  printForms: (params) => doGet('app/forms/formPrint', params),
  //下载模板excle
  downloadTemplate: (params) => doGet('app/forms/exportModel/', params),
  //导入Excle数据
  importExcleData: (params) => doPost('app/forms/importComponentData', params),
  //批量编辑
  batchEdits: (params) => doPut('/app/forms/batchEditor', params),
  // 根据id查询单条表单数据
  findSimpleFormDataById: (id) => doGet(`/app/forms/findSimpleFormDataById/${id}`),
  //通过关联规则id查询关联的列表
  getRelationListByRuleId: (id, ruleId, params) => doGet(`/app/forms/${id}/${ruleId}/connection`,params),
  //关联表单数据数据
  relationData: (id, ruleId, params) => doPut(`/app/forms/${id}/${ruleId}/connection`, params),
  //获取批量适配数据
  getAdaptationData: (id, ruleId) => doGet(`/app/forms/${id}/${ruleId}/adaptation`),
  //关联批量适配数据
  relationAdaptationData: (id, ruleId, params) => doPut(`/app/forms/${id}/${ruleId}/adaptation`, params),
  getFromDataById: (id) => doGet(`/app/forms/findFormDataById/${id}`),
  // 保存用户表单表格显示列
  saveTableHeadShowList: (params) => doPost(`/app/forms/maintainUserPersonalized`, params),
  // 录入表单时添加选项
  addControlChoiceItem: (id, params) => doPut(`/app/forms/addChoiceBoxOtherValue/${id}`, params),
  // 提交所有数据返回验证不通过的数据
  validateFormData: (id, params) => doGet(`/app/forms/validateFormData/${id}`, params),
  // 查询未填写完整的数据
  getFromDataByIds: (ids) => doGet(`/app/forms/findFormDataByIds`, ids),
  // 批量复制
  batchCopy: (ids) => doPost(`/app/forms/batchCopy`, ids),
  // 作废数据、取消作废 --- 录入数据页面使用
  nullifyFormData: (params) => doPut(`/app/forms/validateAndInvalidateFormData`, params),
  // 扫码录入页面作废数据 / 取消作废
  nullifyScanCodeData: (params) => doPut(`/app/forms/validateAndInvalidatecodeScanningData`, params),
  // 获取关联数据父级所在的页码， 返回上级使用
  getFatherPage: (id, params) => doGet(`/app/forms/backToFatherData/${id}`, params),
  // 设置录入页面数据排序规则
  saveUserPersonalizedOrder: (params) => doPut(`/app/forms/maintainUserPersonalizedOrder`, params),
  // 获取录入页面数据排序规则
  getUserPersonalizedOrder: (id) => doGet(`/app/forms/maintainUserPersonalizedOrder/${id}`),
  // 根据控价id查询该字段下的所有值(表单录入筛选使用)
  getAllDataByControlId: (id, params) => doGet(`/app/forms/findFilterOptions/${id}`, params),
  // 根据控价id查询该字段下的所有值(扫码、收样筛选使用)
  getAllDataByControlIdfromScanCode: (id, params) => doGet(`/app/forms/findFilterOptionsOfSampling/${id}`, params)

};
export default formEnterService;
