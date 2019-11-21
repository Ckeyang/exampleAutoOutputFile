import { doGet, doPut, doPost } from '../../../axiosconfig/index.js';

let laboratorySamplingService = {
  // 获取表头结构
  getTitleList: id => doGet(`/app/forms/getLaboratorySampleCollectionTableStructure/${id}`),
  get: params => doPost(`/app/forms/getSampleCollectionListDataByNumbering`, params),
  put: params => doGet(`/app/forms/laboratorySampleCollection`, params),
  delete: id => doPut(`/app/forms/cancelSampleCollection/${id}`, {}),
  // 扫码搜索表单数据
  scanCodeEntry: (params) => doGet(`/app/forms/scanCodeEntry`, params),
  // 获取上一次录入的数据
  getLastScanCodeData: (params) => doGet(`/app/forms/getLastEntry`, params),
  // 获取所有的扫码数据
  getScanCodeAllData: (params) => doPost(`/app/forms/getSampleCollectionListDataByParams`, params),
  // 修改扫码的数据
  saveScanCodeEntryData: (params) => doPut(`/app/forms/scanCodeModifyData`, params),
  getWaitSampleCollectedListData: (params) => doPost('/app/forms/getWaitSampleCollectedListData', params),
  validateAndInvalidateSamplingData: (params) => doPut('/app/forms/validateAndInvalidateSamplingData', params),
  // 添加平行样
  copyScanCodeEntryData: (params) => doPost('/app/forms/addSameSampleData', params),
  multipleLaboratory:(params)=>doPut('/app/forms/batchSampleCollection', params)
};
export default laboratorySamplingService;
