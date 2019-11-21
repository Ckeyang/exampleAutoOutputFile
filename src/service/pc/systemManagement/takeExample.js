import { doGet, doPost, doPut } from '../../../axiosconfig/index.js';
let takeExampleService = {
  getList: (params) => doGet('/app/samplingMethod/findSamplingMethodByCategory', params),
  create: (params) => doPost('/app/samplingMethod', params),
  updateState: (id, status) =>
    doPut(
      `/app/samplingMethod/changeState/${id}?enableOrDisable=${status}`,
      {}
    ),
  update: (id, params) => doPut(`/app/samplingMethod/${id}`, params)
};
export default takeExampleService;
