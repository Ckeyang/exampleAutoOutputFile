const tableRowsBtn = {
  created() {
    this.getauthBtn()
  },
  methods: {
    //初始化页面有权限的按钮
    getauthBtn() {
      const permissionIds = this.authBtn.map(item => item.permissionId)
      const authPermisIds = this.checkAuthAllBtn(permissionIds)
      this.authBtn = this.filterBtn([...new Set(authPermisIds)], 'permissionId')
    },
    // 设置表格每一行的按钮
    setTableRowBtn(data) {
      data.forEach(item => {
        const btnList = this.authBtnShow(item) // 每行数据的状态对应的按钮列表
        item.tableRowBtn = {
          normal: btnList.length > 2 ? btnList.slice(0, 2) : btnList, // 普通显示的按钮
          more: btnList.length > 2 ? btnList.slice(2, btnList.length) : [] // 下拉显示的按钮
        }
      })
      return data
    },
    // 根据权限按钮的key的映射获取当前按钮的完整信息
    /**
     * @param { Array } filedList  按钮权限列表
     * @param { String } prop  对应的key值 默认对比type字段
     */
    filterBtn(filedList, prop = 'type') {
      let tempArr = []
      filedList.forEach(ele => {
        this.authBtn.forEach(item => {
          if (item[prop] === ele) {
            tempArr.push(item)
          }
        })
      })
      return tempArr
    }
  }
}
export default tableRowsBtn
