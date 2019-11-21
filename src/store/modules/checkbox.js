export default {
  state: {
    captionsList: [], //所有省会数据
    filedList: [] //动态数据当先选择表单的的字段列表
  },
  mutations: {
    saveFiledList(state, obj) {
      state.filedList = obj.data;
    },
    //保存省会，后面的地址控件直接取这里的数据
    saveCaptionsList(state, obj) {
      state.captionsList = obj.data;
    }
  }
};
