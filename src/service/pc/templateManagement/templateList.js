import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';
let templateListService = {
  //获取模板列表
  getTemplates: (params) => doGet('app/templates?', params),
  //创建模板
  addTemplates: (params) => doPost('app/templates', params),
  //删除模板
  removeTemplate: (params) => doDelete('app/templates/', params),
  //移动模板
  moveTemplate: (id, params) => doPut('app/templates/' + id + '/move', params),
  //预览模板
  previewTemplate: (id, params) => doPost('app/templates/' + id + '/preview', params),
  //复制模板
  copyTemplate: (params) => doPost('app/templates/' + params + '/copy'),
  //创建分组
  addGroup: (params) => doPost('app/templates/group', params),
  //获取分组列表
  getGroupsList: (params) => doGet('app/templates/menus', params),
  //修改模板名称
  changeTemplateName: (params1, params2) => doPut('app/templates/name/' + params1, params2)
};
export default templateListService;
