import { doGet } from '../../../axiosconfig/index.js';
let userService = {
  getJurisdictionTree: (params) => doGet('/app/my/menus', params)
};
export default userService;
