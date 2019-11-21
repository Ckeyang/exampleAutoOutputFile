import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';
let customerNumberService = {
  getCustomerNumberList: (params) =>
    doGet('/app/customNumber/customNumberList', params),
  getCustomerNumberPrefixList: (params) =>
    doGet('/app/customNumber/prefixList', params),
  create: (params) => doPost('/app/customNumber', params),
  update: (id, params) => doPut('/app/customNumber/' + id, params),
  delete: (id) => doDelete('/app/customNumber/' + id),
  enableOrDisable: (id, status) =>
    doPut(`/app/customNumber/changeState/${id}?enableOrDisable=${status}`, {})
};
export default customerNumberService;
