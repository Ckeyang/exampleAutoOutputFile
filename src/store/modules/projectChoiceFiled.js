export default {
  state: {
    curTemplateFiledIds: [] //模板里面已选择了的字段fieldId列表
  },
  mutations: {
    recursionTemplate(state, obj) {
      state.curTemplateFiledIds = obj.val.map(
        item => item.componentAttr.fieldId
      );
      state.curTemplateFiledIds = mapTemplate(obj.val)
    }
  }
};
// 递归组件
const mapTemplate = function(data, filedIds = []) {
  data.forEach(item => {
    if (item.componentType === 'CUSTOMBOX' && Array.isArray(item.components)) {
      mapTemplate(item.components, filedIds);
    } else {
      filedIds.push(item.componentAttr.fieldId);
    }
  });
  return filedIds;
};
