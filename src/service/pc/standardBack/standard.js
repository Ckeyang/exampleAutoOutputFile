import { doPost, doGet, doDelete, doPut } from '../../../axiosconfig/index.js';
export default {
  //标准列表
  getDataList: (params) => doGet('/app/literature/findLiteratureByParamsWithPage', params),
  //标准词条
  getWordList: (params) => doGet(`/app/lexicons/findLexiconsByDataId`, params),
  //删除标准
  removeList: (params) => doDelete('app/standards/', params),
  //通过id查询标准数据
  getDataById: (params) => doGet('app/standards/', params),
  //提交审核基本信息
  standardExaminePostil: (params) => doPost('app/standards/auditStandard', params),
  //词条批示
  addWordsPosilt: (params) => doPost('app/standards/addEntryNotation', params),
  //审核通不通过按钮
  auditState: (params) => doPost('app/standards/auditStandardState', params),
  //获取有批示的词条
  getWordsPosilt: (params) => doGet('app/standards/findEntryById/', params),
  //修改标准
  editStandard: (param1, param2) => doPut('app/standards/' + param1, param2)
};
