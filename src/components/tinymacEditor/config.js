let config = {
  width: '99%',
  height: '78.33vh',
  language: 'zh_CN',
  language_url: 'http://file.zhkytj.cn/zh_CN1544770162474.js',
  extended_valid_elements: 'span[fieldid|style],img[fieldid|src|alt|style],table[fieldid|style],embed',
  plugins: ['image', 'table'],
  images_upload_handler: function (blobInfo, success, failure) {
    var xhr, formData;
    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', '/files/ckeditor');

    xhr.onload = function () {
      var json;

      if (xhr.status !== 200) {
        failure('HTTP Error: ' + xhr.status);
        return;
      }
      json = JSON.parse(xhr.responseText);

      if (!json || typeof json.url !== 'string') {
        failure('Invalid JSON: ' + xhr.responseText);
        return;
      }

      success(json.url);
    };

    formData = new FormData();
    formData.append('upload', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  },
  resize: false
};
export default config;
