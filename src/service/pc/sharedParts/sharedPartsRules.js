import {
  doGet,
  doPut
} from '../../../axiosconfig/index';
let sharedPartsRulesService = {
  //获取所有的公式列表
  getFormulaList: (params) => doGet('/app/formula', params),
  //获取系统变量字段
  getSystemFileds: (params) => doGet('/app/shareComponent/findListByEnum', params),
  //添加规则
  addSharePartRules: (id, params) => doPut(`/app/shareComponent/${id}`, params),
  getSharePartByIds: (ids) => doGet('/app/shareComponent/multiple', ids),
  getDeviceList: (param = {}) => doGet('/app/equipment/findAll', param),
  getMaterialtList: (param = {}) => doGet('/app/substances/static/form/findAll', param),
  getExampletList: (param = {}) => doGet('/app/samplingMethod/samplingMethodList', param),
  getBasisBankList: (param = {}) => doGet('/app/basisLibrary/findLiteratureByParamsWithPage', param),
  getevaluateBankList: (param = {}) => doGet('/app/evaluationMethodLibrary/findAll', param),
  // 获取数据来源字段列表
  getDataSourceList: () => doGet(`/app/shareComponent/getDataSourceType`)
};
export default sharedPartsRulesService;
