import {
  doGet,
  doPost,
  downloadFile,
  doDelete,
  doPut
} from '../../../axiosconfig/index.js';
let deviceService = {
  // 获取所有设备列表
  getDevicesList: (params) => doGet('/app/equipment/equipmentList', params),
  //下载设备模板
  downLoadTemplate: (params) => doGet('/app/equipment', params),
  //返回url
  doenLoad: (params) => downloadFile(params),
  removeDevice: (id) => doDelete(`/app/equipment/deleteEquipmentById/${id}`),
  saveDeviceTags: (params) => doPut(`/app/equipment/addLabelToEquipment`, params),
  //导入excel
  importTemplate: (params) => doPost('/app/equipment/importEquipment', params),
  //导出excel
  exportTemplate: (params) => doGet('/app/equipment/exportEquipments', params)

};
export default deviceService;
