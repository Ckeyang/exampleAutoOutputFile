import { doGet, doDelete, doPost, doPut } from '../../../axiosconfig/index.js';

let noticeService = {
  /**
   * 获取公告列表
   */
  getNoticeList: (params) => doGet('/app/announcements', params),
  /**
   * 通过不通过
   */
  passNotice: (params) => doPost('/app/announcements/auditState', params),
  /**
   * 删除公告
   */
  deleteNoticeItem: (id) => doDelete('/app/announcements/', id),
  /**
   * 创建公告
   */
  createNotice: (params) => doPost('/app/announcements', params),
  /**
   * 修改公告
   */
  updateNotice: (id, params) => doPut('/app/announcements/' + id, params),

  /**
   * 修改公告词条
   */
  updateNoticeWord: (id, params) =>
    doPut('/app/announcements/wordItems/' + id, params),
  /**
   * 获取公告
   */
  getNoticeById: (id) => doGet('/app/announcements/' + id, {}),
  /**
   * 获取公告标准列表
   */
  getNoticeStandardList: (params) =>
    doGet('/app/announcements/wordItem', params),
  /**
   * 审核公告
   */
  announcementsAudit: (params) => doPost('/app/announcements/audit', params),
  /**
   * 审核公告词条添加批注
   */
  announcementsAuditWordItems: (params) =>
    doPost('/app/announcements/audit/wordItems', params),
  /**
   * 创建公告词条
   */
  createNoticeWordBar: (params) =>
    doPost('/app/announcements/wordItems', params),
  /**
   * 创建词条备注
   */
  createWordBarDesc: (params) => doPost('/app/announcements/tag', params)
};

export default noticeService;
