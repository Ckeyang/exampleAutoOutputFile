export default {
  state: {
    tagsList: [], //保存所有的tabs
    cachesRouters: [] // 缓存的路由列表
  },
  mutations: {
    //改变tagsList
    tag_changeTagsList(state, obj) {
      state.tagsList = obj.tags;
      state.cachesRouters = obj.tags.map(item => item.name)
    },
    //修改title
    tag_editTagsTitle(state, obj) {
      state.tagsList = state.tagsList.map(item => {
        item.path === obj.path && (item.title = obj.title)
        return item
      })
    },
    //清除tags
    tag_deleteTags(state, obj) {
      state.tagsList = state.tagsList.filter(item => {
        return item.path !== obj.path
      })
    },
    tag_deleteTagsByPath(state, path) {
      state.tagsList = state.tagsList.map(item => {
        if (item.path.indexOf(path) > 0) {
          return item
        }
      })
    },
    // addCachesRouters(state, obj) {
    //   state.cachesRouters.push(obj.name)
    // },
    // 删除缓存
    remoreCachesRouters(state, obj) {
      state.cachesRouters = state.cachesRouters.filter(item => item !== obj.name)
    }
  },
  actions: {
    deleteTagsByPath(state, path) {
      state.commit('tag_deleteTagsByPath', path)
    }
  }
}
