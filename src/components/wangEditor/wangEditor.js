const E = window.wangEditor;// 使用 npm 安装
export function createEditor(tool, id) {
  let editor = new E('#' + tool, '#' + id);
  return editor;
}
