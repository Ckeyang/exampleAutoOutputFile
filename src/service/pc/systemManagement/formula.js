import { doGet, doPut } from '../../../axiosconfig/index.js';
let formulaService = {
  getList: (params) => doGet('/app/formula', params),
  update: (id, status) => doPut(`/app/formula/${id}/${status}`, {})
};
export default formulaService;
