import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index.js';

let basisBank = {
  getCategories: (params) => doGet('/app/categories/evaluate', params),
  getMaterialList: (params = {}) =>
    doGet('/app/substances/static/form/findAll', params),
  getCities: (params = {}) => doGet('/app/categories/industryTree', params),
  getBasisBankList: (params) => doGet('/app/basisLibrary/findBasisLibraryByParamsWithPage', params),
  createBasisBank: (params) => doPost('/app/basisLibrary', params),
  updateBasisBank: (id, params) => doPut('/app/basisLibrary/modifyBasisLibrary/' + id, params),
  getNeedSynchronization: (params) => doGet('/app/basisLibrary/findNeedSynchronizationLiteratureWithPage', params),
  saveSynchronization: (params) => doPut(`/app/basisLibrary/synchronizationBasisLibrary`, params),
  getLiteratureType: (params) => doGet(`/app/literature/findWaitLiteratureListWithPage`, params),
  getLiteratureView: (identifier, params) => doGet(`/app/basisLibrary/findLiteratureByBasisLibrary/${identifier}`, params),
  getBasisProjects: (basisId, params) => doGet(`/app/basisLibrary/${basisId}/projects`, params),
  saveConnection: (basisId, params) => doPut(`/app/project/bases/${basisId}/connection`, params),
  deleteBasisBank: (params) => doDelete('/app/bases/', params),
  copyBasisBank: (id, params) => doPut('/app/basisLibrary/copyBasisLibrary/' + id, params),
  getBasisBankById: (id) => doGet('/app/basisLibrary/findBasisLibraryById/' + id, {}),
  getBasisCheckList: (params) => doGet('/app/checkLists/list', params),
  createBasisCheck: (params) => doPost('/app/checkLists', params),
  copyBasisCheck: (id) => doPost('/app/checkLists/copy/' + id, {}),
  getBasisCheckById: (id) => doGet('/app/checkLists/' + id, {}),
  updateBasisCheck: (id, params) => doPut('/app/checkLists/' + id, params),
  deleteBasisCheck: (id) => doDelete('/app/checkLists/', id),
  getWordCapter: (id) =>
    doGet('/app/checkLists/findChapterByLiteratureId/' + id),
  getWordsList: (id, params) =>
    doGet('/app/checkLists/findAllItemByParameter/' + id, params),
  getBasisBankLabels: (id, params) =>
    doGet('/app/bases/' + id + '/labels', params),
  getBasisBankStandars: (id, params) =>
    doGet('/app/bases/' + id + '/standards', params),
  getBasisBankStatutes: (id, params) =>
    doGet('/app/bases/' + id + '/statutes', params)
};
export default basisBank;
