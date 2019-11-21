import SearchBox from '@/components/tools/searchBox.vue'
import filterComponent from '@/components/tools/filterComponent/index.vue'
import dynamicDisplayColumn from '@/components/tools/dynamicDisplayColumn/index.vue'
import pagniation from '@/components/tools/Pagniation.vue'
import { mapGetters } from 'vuex'
export default {
  components: { SearchBox, pagniation, filterComponent, dynamicDisplayColumn },
  data() {
    return {
      form: {
        customQuery: {
          keyWords: '',
          projectState: ''
        },
        columns: [],
        current: 0,
        pageSize: 30
      },
      columnKeys: [], // 可搜索的字段列表
      filterData: [],
      filterColumns: null,
      loading: false,
      tableName: 'Project_List', // 该表头的查询枚举
      totalPage: 0,
      totalNum: 0,
      dataList: [],
      tableKey: 0,
      curCheckedTrId: null,
      categoriesList: [], //所有的评价类别树
      firstCategoriesList: [], //检测，咨询一级类别列表
      projectStatelist: Object.freeze({
        // 项目所有状态
        UNPUBLISHED: '待发布',
        PUBLISH: '待分派',
        WAITING_EXECUTION: '待执行',
        WAITING_SUBMIT_SCENE_DATA: '待提交现场数据',
        WAITING_EDIT_SCENE_DATA: '待修改现场数据',
        WAITING_SCENE_REVIEW: '待现场复核',
        WAITING_SUBMIT_TEST_RESULT: '待提交检测结果',
        WAITING_EDIT_TEST_RESULT: '待修改检测结果',
        WAITING_LABORATORY_REVIEW: '待实验室复核',
        WAITING_EDIT_PROJECT_INFO: '待修改项目信息',
        WAITING_GENERATE_REPORT: '待生成报告',
        GENERATED_REPORT: '已生成',
        WAITING_ISSUED: '待签发',
        COMPLETED: '已完成',
        SUSPEND: '已暂停',
        STOPPED: '已终止'
      })
    }
  },
  created() {
    this.form.customQuery.projectState = this.$route.query.projectState || ''
    this.getData(true) //初始化项目列表
    this.getCategories()
  },
  computed: {
    showColumns() {
      // 显示的表头
      this.tableKey++
      return this.form.columns.filter(item => item.displayable)
    },
    // 获取筛选选项的函数
    getOptionsFn() {
      return this.$http.userService.getAllDataByControlId
    },
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  methods: {
    searchData() {
      this.form.current = 0
      // this.getProjectList()
      this.getData()
    },
    getData(init = false) {
      if (init) {
        this.getTableHeade()
      } else {
        this.getProjectList()
      }
    },
    // 高级搜索
    advancedSerach(filterData) {
      this.form.current = 0;
      this.getProjectList(filterData)
    },
    // 组装筛选条件函数
    splitColumnData(filterData = this.filterData) {
      let columns = []
      // const filterData = filterData || this.filterData
      if (!filterData.length) return this.form.columns
      this.form.columns.forEach(item => {
        let findTemp = filterData.find(
          item2 => item2.key === item.filedKey
        )
        if (findTemp) {
          const copyItem = JSON.parse(JSON.stringify(item))
          copyItem.searchable = true
          if (findTemp.separator === 'EQUAL') {
            copyItem.search = {
              operator: 'EQ_STRING',
              value: findTemp.value
            }
            columns.push(copyItem)
          } else if (findTemp.separator === 'CONTAIN') {
            copyItem.search = {
              operator: 'CONTAIN_STRING',
              value: findTemp.value
            }
            columns.push(copyItem)
          } else {
            copyItem.search = {
              operator: 'BEFORE_DATE',
              value: findTemp.startTime
            }
            columns.push(copyItem)
            const copyItem2 = JSON.parse(JSON.stringify(copyItem))
            copyItem2.search = {
              operator: 'AFTER_DATE',
              value: findTemp.endTime
            }
            columns.push(copyItem2)
          }
        } else {
          columns.push(item)
        }
      })
      return columns
    },
    // 获取配置设置以及表头
    getTableHeade() {
      // 获取表头以及显示，排序配置
      this.loading = true
      this.$http.userService
        .getUserDisplaySortTableHead({ name: this.tableName })
        .then(res => {
          // 获取数据
          this.form.columns = res.data.fieldConfigs.map((item, i) => {
            item.weight = i
            item.sort = item.sort || 'ASC'
            return item
          })
          this.getProjectList()
          if (!this.columnKeys.length) {
            this.columnKeys = this.form.columns.map(item => {
              return {
                key: item.filedKey,
                name: item.filedName,
                separator: ['memberNames', 'fullAddress'].includes(
                  item.filedKey
                )
                  ? 'CONTAIN'
                  : ['entrustDate', 'publishedTime'].includes(item.filedKey)
                  ? 'BETWEEN'
                  : 'EQUAL'
              }
            })
          }
        })
    },

    //去表单录入页面
    goToFormPage(name, entrustNumber, companyName, projectId, type) {
      const title = encodeURIComponent(name) //对名字进行十六进制转义
      const number = encodeURIComponent(entrustNumber) //对名字进行十六进制转义
      companyName = encodeURIComponent(companyName) //对名字进行十六进制转义
      this.openWindow(
        `/templatePreview/${title}/${number}/${companyName}/${projectId}/${type}/project`
      )
    },
    //打开项目基本信息窗口
    editProjectForm(id, type) {
      this.$http.projectService.getProjectById(id).then(res => {
        this.curCheckedTrId = id
        let projectForm = {
          projectName: res.data.projectName,
          entrustNumber: res.data.entrustNumber,
          companyName: res.data.companyName,
          contractNumber: res.data.contractNumber,
          entrustDate: res.data.entrustDate || '',
          companyContactName: res.data.companyContactName, // 联系人
          companyContactPhone: res.data.companyContactPhone, // 联系人电话
          addressValue: {
            ...res.data.companyAddress
          },
          evaluationCategory: []
        }
        let temData = res.data.evaluationCategory.split('-')
        for (let i = 0; i < temData.length; i++) {
          projectForm.evaluationCategory.push(temData.slice(0, i + 1).join('-'))
        }
        this.$refs.projectForm.setFrom(
          projectForm,
          res.data.autoGenerateEntrustNumber,
          res.data.autoGenerateContractNumber
        )
        this.dialogType = type
        this.dialogVisible = true
      })
    },
    // 查看项目日志
    goToProjectLogsPage(id) {
      this.openWindow(`/projectLogs/${id}`)
    },
    // 下载记录表
    downLoadRecordSheet(id) {
      this.openWindow(`/download/${id}`)
    },
    //打开新窗口
    openWindow(route, query = {}) {
      window.open(this.$router.resolve({ path: route, query }).href)
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize
      this.form.current = page.currentPage - 1
      this.getProjectList()
    },
    /**
     * 获取类别
     */
    getCategories() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.categoriesList = res.data.childList
      })
    },
    //去除类别为空的数组字段
    reloadCategories(data) {
      let result = []
      data.map(item => {
        let { id, name, childList } = item
        if (childList && childList.length > 0) {
          result.push({
            id: id,
            name: name,
            childList: this.reloadCategories(childList)
          })
        } else {
          result.push({
            id: id,
            name: name
          })
        }
      })
      return result
    },
    //重置搜索
    resetForm() {
      this.form.customQuery.keyWords = ''
      this.form.customQuery.projectState = ''
      this.form.pageSize = 30
      this.form.current = 0
      this.getProjectList()
    },
    //项目状态转换
    projectState(state) {
      return this.projectStatelist[state]
    }
  }
}
