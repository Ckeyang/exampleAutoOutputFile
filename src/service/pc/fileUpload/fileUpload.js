import {
  doUploadFileFormData,
  downloadFile
} from '../../../axiosconfig';
let fileService = {
  uploadFile: (formData) => doUploadFileFormData('/files/file', formData),
  //项目录入下载模板
  downloadFile: (url = '') => downloadFile('/app/forms/exportModel/', url)
};
export default fileService;
