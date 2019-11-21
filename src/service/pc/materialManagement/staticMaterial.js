import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';
let staticMaterialService = {
  getList: params => doGet('/app/substances/static/form', params),
  getMaterialById: id => doGet(`/app/substances/static/form/${id}`, {}),
  create: params => doPost('/app/substances/static/form', params),
  update: (id, params) => doPut(`/app/substances/static/form/${id}`, params),
  delete: id => doDelete(`/app/substances/static/form/`, id),
  getRevisionRule: params => doGet('/app/substances/static/form/revisionRule', params),
  getRevisionRuleAll: id => doGet(`/app/substances/static/form/revisionRule/${id}`, {}),
  updateRevision: (id, params) => doPut(`/app/substances/static/form/revisionRule/${id}`, params),
  createRevision:(params)=>doPost('/app/substances/static/form/revisionRule',params)
};
export default staticMaterialService;
