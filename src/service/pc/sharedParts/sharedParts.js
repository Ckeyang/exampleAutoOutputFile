import { doGet, doPut, doPost, doDelete } from '../../../axiosconfig/index';
let sharedPartsService = {
  getSharedPartsList: (params) => doGet('/app/shareComponent/list', params),
  getSharedParts: (params) => doGet('/app/shareComponent/paging/list', params),
  getSharedPartsInTempalte: (params) => doGet('/app/shareComponent/choice', params), //项目模板选择字段
  createSharedPart: (params) => doPost('', params),
  updateSharedPart: (id, params) => doPut('/' + id, params),
  deleteSharedPart: (id) => doDelete('/app/shareComponent/', id),
  copySharePart: (id) => doPut(`/app/shareComponent/${id}/copy`),
  stopUseSharedPart: (id, flag) => doPut('/app/shareComponent/changeState/' + id + '?enableOrDisable=' + flag, {}),
  getSharePartById: (id) => doGet('/app/shareComponent/' + id, {}),
  //添加共享件
  addSharePart: (params) => doPost('/app/shareComponent', params),
  //修改共享件
  editSharePart: (id, params) => doPut('app/shareComponent/' + id, params),
  //更新模板
  updateTemplate: (id, params) => doPut(`app/shareComponent/${id}/templates/sync`, params),
  //根据名称查询相似共享件(简化版)
  getSameNameParts: (params) => doGet('/app/shareComponent/choice', params),
  // 根据名称查询共享件(完整版)
  getPartsList: (params) => doGet('/app/shareComponent/suggestive', params),
  //根据id获取共享件
  getSharedPartsFieldById: (id) => doGet('app/shareComponent/', id)
};
export default sharedPartsService;
