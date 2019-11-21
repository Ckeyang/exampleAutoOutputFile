import {
  doGet,
  doPost,
  doPut,
  doDelete
} from '../../../axiosconfig/index.js';
let templateService = {
  //获取基础组件
  getBasicComponents: (params) => doGet('app/componentOpr/findBasicComponents', params),
  //获取高级组件
  getComplicatedComponents: (params) => doGet('app/componentOpr/findComplicatedComponents', params),
  //获取自定义组件
  getCustomComponents: (params) => doGet('app/componentOpr/findCustomComponents', params),
  //保存为组件
  saveCustomAssembly: (params) => doPost('app/componentOpr/create', params),
  //修改组件，并同时修改引用此组件并保持同步的组件
  editCustomAssembly: (params) => doPut('app/componentOpr/modifyComponentAndRelates', params),
  //修改组件属性
  editCustomAssemblyProps: (params) => doPut('/app/componentOpr/change', params),
  //根据originalId获取组件引用的列表
  getAssemblyEditEffectList: (params) => doGet('app/componentOpr/findAllRelatedComponents/', params),
  //新建组件文件夹
  addNewfolder: (params) => doPost('app/folders', params),
  //修改组件文件夹
  editfolder: (params) => doPut('app/folders', params),
  //删除组件文件夹
  deleteFolder: (params) => doDelete('app/folders?', params),
  //保存组件和文件夹排序
  saveFolderSort: (params) => doPut('app/folders/ordering', params),
  //根据id获取组件内容
  getAssmeblysDataById: (params) => doGet('app/componentOpr/findComponentById/', params),
  //删除组件
  deleteCustomAssembly: (params) => doDelete('app/componentOpr/delete/', params),
  //获取模板
  getTemplateById: (params) => doGet('app/templates/', params),
  //保存为模板
  saveTemplate: (params) => doPost('app/templates', params),
  // 修改模板
  editTemplate: (param1, params) => doPut('app/templates/' + param1, params),
  //发布模板
  releaseForms: (params) => doPost('app/templates/publish', params),
  //预览模板
  previewTemplate: (identifier, id, params) => doPost(`app/templates/${identifier}/${id}/preview`, params),
  //移除预览所生成的表单
  deletePreviewForm: (identifier, id, params) => doDelete(`app/templates/${identifier}/${id}/preview`, params),
  //根据评价类别获取所有的表单 (组件用)
  getFromList: (params) => doGet('app/templates/findByEvaluateId/', params),
  //获取模板下面的所有字段
  getTreeListByTempId: (params) => doGet('app/forms/findFormByProjectTemplateId/', params),
  //根据id获取组件下面所有的字段
  getAssemblyAllFileds: (param1, param2) => doGet(`app/templates/${param1}/${param2}/widgets`, ''),
  //获取组件树
  getAssemblyData: (params) => doGet(`/app/templates/${params}/componentTree`, ''),
  //根据类型id获取所有的模板
  getTemplateByCategoryId: (params) => doGet(`/app/templates/findByEvaluateId/${params}`),
  //保存数据规范设置
  saveDataSetting: (param1, param2, params) => doPut(`app/templates/${param1}/${param2}/specification`, params),
  //获取所有的编号或者公式
  getFormulaLists: (param1, param2) => doGet(`app/templates/${param1}/items`, param2),
  // 获取动态表单系统参数列表（模板设置动态数据）
  getChoiceDynamicDataType: () => doGet(`/app/forms/getChoiceDynamicDataType`),

  /**
   * 获取物质
   */
  getMaterial: (params) => doGet('/app/substances/findSubstanceWithSnapshot/' + params, {}),
  /**
   * 保存物质
   */
  saveMaterial: (params) => doPost('/app/substances/updateSubstanceSnapshot', params),
  //获取分组列表
  getGroupList: (params) => doGet('app/templates/group', params)
};
export default templateService;
