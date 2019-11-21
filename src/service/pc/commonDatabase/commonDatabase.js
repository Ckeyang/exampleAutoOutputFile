import { doGet, doPut, doPost } from "../../../axiosconfig/index.js";
let commonDatabaseService = {
  getCommonDatabaseList: params => doGet("/app/publicData/findPublicData", params),
  getDataLinkageByParamsWithPage: params => doPost("/app/publicData/findDataLinkageByParamsWithPage", params),
  exportData: params => doGet(`/app/publicData/exportPublicDataByEnum`, params),
  exportTemplate: params => doGet(`/app/publicData/downloadExcelTemplateByType`, params),
  getSamplingLinkageByParamsWithPage: params => doPost("/app/publicData/findSamplingLinkageByParamsWithPage", params),
  importTemplate: params => doPost(`/app/publicData/importEquipment`, params),
  getMethodsStructure: params => doGet(`/app/publicData/findListByTableEnum`, params),
  changePublicData: (id, params) => doPut(`/app/publicData/changePublicData/${id}`, params)
};
export default commonDatabaseService;
