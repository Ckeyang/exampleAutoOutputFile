import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';
let labelBankService = {
  getLabelBankList: (params) => doGet('/app/labels/paging/findLabels', params),
  getLabelBankListAll: (params) => doGet('/app/labels/findLabels', params),
  getLabelTree: (params) => doGet(`/app/labels/findByType`, params),
  createLabel: (params) => doPost('/app/labels', params),
  addLabelToStatute: (id, params) =>
    doPut('/app/statutes/statue/addLabelForStatute/' + id, params),
  addTagToStatuteWord: (id, params) =>
    doPut('/app/statutes/statue/addLableForStatueItem/' + id, params),
  removeTagFromStatute: (id, params) =>
    doDelete('/app/statutes/delLabelByStatuteId/', id + '?labelName=' + params),
  removeTagFromStatuteWord: (id, params) =>
    doDelete(
      '/app/statutes/delLabelByStatuteItemId/',
      id + '?labelName=' + params
    ),
  addTagToStandard: (id, params) =>
    doPut('/app/standards/standard/addLabelForStandard/' + id, params),
  addTagToStandardWord: (id, params) =>
    doPut('/app/standards/standard/addLableForStandardItem/' + id, params),
  removeTagFromStandard: (id, params) =>
    doDelete(
      '/app/standards/delLabelByStandardId/',
      id + '?labelName=' + params
    ),
  removeTagFromStandardWord: (id, params) =>
    doDelete(
      '/app/standards/delLabelByStandardItemId/',
      id + '?labelName=' + params
    ),
  getTagsWithStandard: (id, params) =>
    doGet('/app/standards/findLabelByStandardId/' + id, params),
  getTagsWithStandardWord: (id, params) => doGet('/app/standards/findLabelByStandardItemId/' + id, params),
  getTagsWithStatute: (id, params) =>
    doGet('/app/statutes/findLabelByStatuteId/' + id, params),
  getTagsWithStatuteWord: (id, params) => doGet('/app/statutes/findLabelByStatuteItemId/' + id, params),
  getLabel: (params) => doGet('/app/labels/search', params)
};
export default labelBankService;
