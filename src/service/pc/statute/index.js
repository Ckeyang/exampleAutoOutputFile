import {
  doPost,
  doGet,
  doDelete,
  doPut
} from '../../../axiosconfig/index.js';

function getDataAll(params) {
  return doGet('/app/literature/findLiteratureByParamsWithPage', params);
}

function getReglation(params) {
  return doGet('app/statutes/statutes', params);
}
// 根据id获取法规数据
function getDataById(params) {
  return doGet('app/statutes/', params);
}

function getCityesForId(params) {
  return doGet('app/categories/', params);
}

function getCityesForName(params) {
  return doGet('app/categories/name', params);
}
// 根据名字查询行业
function getKindsForName(params) {
  return doGet('app/categories/industry/name', params);
}

function getKind(params) {
  return doGet('app/categories/industry/', params);
}

function getWords(params) {
  return doGet('/app/literature/findLiteratureEntry', params);
}

function getReglationAddNotices(params) {
  return doGet('app/notices/', params);
}
// 得到所有有批注的词条
function getPositlWords(params) {
  return doGet('app/statutes/itemsTag', params);
}
// 根据法规查询通知词条
function getRealationWords(params) {
  return doGet('app/notices/noticeitems', params);
}
// 获取该通知下所有的通知词条
function getAllNoticesContent(params) {
  return doGet('app/notices/noticeEntry/', params);
}

function uploadFile(params) {
  return doPost('files', params);
}

function reglationLoad(params) {
  return doPost('app/statutes', params);
}

function noticeLoad(params) {
  return doPost('app/notices', params);
}

function reglationExaminePostil(params) {
  return doPost('app/statutes/regulatory', params);
}

function reglationExamineState(params) {
  return doPost('app/statutes/State', params);
}

function addWordsRemarks(params) {
  return doPost('app/statutes/tag', params);
}

function wordsExaminePostil(params) {
  return doPost('app/statutes/instruction', params);
}
// 添加通知词条
function addNoticeWords(params) {
  return doPost('app/notices/entrys', params);
}

// 审核通知是否通过
function noticeExamineState(params) {
  return doPost('app/notices/auditState', params);
}
// 审核通知基础数据
function examineNotice(params) {
  return doPost('app/notices/audit', params);
}
// 通知词条是否通过
function noticeWordsPostil(params) {
  return doPost('app/notices/entryNotation', params);
}

function deleReglation(params) {
  return doDelete('app/statutes/statute/', params);
}

function reglationEdit(param1, param2) {
  return doPut('app/statutes/statute/' + param1, param2);
}
// 修改通知
function editNotices(param1, param2) {
  return doPut('app/notices/notice/' + param1, param2);
}
// 修改通知词条
function editNoticesWords(param1, param2) {
  return doPut('app/notices/notifyEntry/' + param1, param2);
}
let statuteApi = {
  //----------------------法规库-------------------------------
  getDataAll, //获取法规和通知
  getReglation, //获取法规
  getWords, //获取词条
  addWordsRemarks, //添加词条的备注
  uploadFile, // 上传文件
  reglationLoad, //录入法规
  deleReglation, //删除法规、通知
  getCityesForId, //根据id获取城市
  getCityesForName, //根据城市名称获取城市
  getKind, //获取行业分类
  reglationExaminePostil, //法规审核批注
  reglationExamineState, //法规状态的
  wordsExaminePostil, //词条的批注
  reglationEdit, //法规修改
  noticeLoad, //录入通知
  getReglationAddNotices, //根据通知id获取通知以及关联的法规
  addNoticeWords,
  examineNotice,
  noticeExamineState,
  getRealationWords,
  noticeWordsPostil,
  editNotices,
  editNoticesWords,
  getKindsForName,
  getPositlWords,
  getAllNoticesContent,
  getDataById
};
export default statuteApi;
