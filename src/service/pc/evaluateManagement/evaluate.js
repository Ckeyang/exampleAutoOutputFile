import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';
let evaluateService = {
  getMethodRevision: (methodDataId) => doGet(`/app/revisionRules/findRevisionRuleByMethodDataId/${methodDataId}`),
  createMethodRevision: (params) => doPost(`/app/revisionRules/addRevisionRule`, params),
  updateMethodRevision: (id, params) => doPut(`/app/revisionRules/changeRevisionRule/${id}`, params),
  getEvaluateList: (params) => doGet('/app/method/findMethodStructure', params),
  createEvaluate: (params) => doPost('/app/method/createMethodStructure', params),
  copyEvaluate: (id, params) => doPut(`/app/method/copyMethodStructureAndData/${id}`, params),
  getMethods: (params) => doGet('/app/method/findMethodByParamsWithPage', params),
  createMethod: (params) => doPost('/app/method/createMethod', params),
  updateMethod: (id, params) => doPut(`/app/method/modifyMethod/${id}`, params),
  getMethodsStructure: (id, params) => doGet(`/app/method/findMethodStructure/${id}`, params),
  getMethodsById: (id) => doGet(`/app/method/findMethodById/${id}`),
  deleteMethod: (id) => doDelete(`/app/method/deleteMethod/${id}`),
  copyMethod: (id, params) => doPut(`/app/method/copyMethod/${id}`, params),
  putTags: (id, params) => doPut(`/app/method/addLabelToMethod/${id}`, params),
  saveStructure: (id, params) => doPut(`/app/method/modifyMethodStructure/${id}`, params),
  deleteStructure: (indetifier, id) => doDelete(`/app/method/deleteMethodStructure/${indetifier}/${id}`)
};
export default evaluateService;
