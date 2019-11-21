import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';
let materialService = {
  /**
   * 获取物质列表
   */
  getMaterialList: (params) => doGet('/app/substances', params),
  /**
   * 获取物质列表
   */
  getMaterial: (params) => doGet('/app/substances/static/form/recorded', params),
  /**
   * 创建物质
   */
  createMaterial: (params) => doPost('/app/substances', params),
  /**
   * 修改物质
   */
  updateMaterial: (id, params) => doPut('/app/substances/' + id, params),
  /**
   * 删除物质
   */
  deleteMaterial: (params) => doDelete('/app/substances/', params),
  /**
   * 获取物质类别列表
   */
  getMaterialTypeList: (params) =>
    doGet('/app/substance/category/findAll', params),
  /**
   * 创建物质类别
   */
  createMaterialType: (params) => doPost('/app/substance/category', params),
  /**
   * 删除物质类别
   */
  deleteMaterialType: (params) => doDelete('/app/substance/category/', params),
  /**
   * 修改物质类别名字
   */
  updateMaterialTypeName: (id, params) =>
    doPut('/app/substance/category/rename/' + id, params),
  /**
   * 修改物质模板
   */
  updateMaterialTemplate: (id, params) =>
    doPut('/app/substance/category/bind/template/' + id, params),
  /**
   * 获取物质模板列表
   */
  getMaterialTemplateList: (params) =>
    doGet('/app/substance/templates', params),
  /**
   * 获取物质模板列表 未绑定的
   */
  getMaterialTemplateUnbindList: (params) =>
    doGet('/app/substance/templates/unbind', params),
  /**
   * 删除物质模板
   */
  deleteMaterialTemplate: (params) => doDelete('', params)
};
export default materialService;
