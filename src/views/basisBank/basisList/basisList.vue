<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="业务类别">
            <el-cascader
              :options="categories"
              clearable
              :show-all-levels="false"
              v-model="form.businessClassificationIds"
              :props="{ label: 'name', children: 'childList', value: 'id' }"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
      <!-- <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>-->
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">依据列表</h5>
        <div>
          <el-button size="small" :class="synchronizedList.length != 0 ? 'blin' : ''" @click="synchronizedRecord"
            ><i class="iconfont icon-tongbu"></i>同步记录</el-button
          >
          <el-button type="success" size="small" class="entry-btn" icon="el-icon-plus" @click="addBewBasis">新增依据</el-button>
        </div>
      </div>
      <el-table :data="dataList">
        <template slot="empty">
          <br />
          <br />
          <img src="@/assets/empty.png" />
          <br />
          <span>暂无数据</span>
          <br />
          <br />
          <br />
          <br />
        </template>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div style="backgournd-color:#cccccc">
              <el-table class="expandTable" :data="scope.row.basisLibraryQueryHistoryList" :show-header="false">
                <el-table-column width="99"></el-table-column>
                <el-table-column width="150" prop="businessClassificationName"></el-table-column>
                <el-table-column width="210" prop="businessCategoryName"></el-table-column>
                <el-table-column width="150" prop="versionTimeStr"></el-table-column>
                <el-table-column prop="revisedRecords" show-overflow-tooltip>
                  <template slot-scope="sc">
                    {{ sc.row.revisedRecords }}
                  </template>
                </el-table-column>
                <el-table-column width="50" prop="revisedRecords">
                  <template slot-scope="sc">
                    <el-popover v-if="sc.row.revisedRecords" width="300" target="click" :content="sc.row.revisedRecords">
                      <i slot="reference" class="iconfont icon-i-dingdanxinxi"></i>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column width="300">
                  <template slot-scope="sc">
                    <div class="operation-icon">
                      <i class="iconfont icon-chakan icon-edit" @click="goRoutePath('/basisBank/basisDetail', sc.row.id)"
                        >查看</i
                      >
                      <i class="iconfont icon-shiyongxiangmu" @click="openDialog(sc.row)">适用项目</i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <el-row
                v-for="(item, index) in scope.row.basisLibraryQueryHistoryList"
                :key="index"
                :gutter="20"
              >
                <el-col :span="2" :offset="1" style="text-align:center">{{ item.businessClassificationName }}</el-col>
                <el-col :span="2" style="text-align:center">{{ item.businessCategoryName }}</el-col>
                <el-col :span="3" style="text-align:center">{{ item.versionTimeStr }}</el-col>
                <el-col :span="11"
                  ><span class="nowrap">{{ item.revisedRecords }}</span></el-col
                >
                <el-col :span="1">
                  <el-popover v-if="item.revisedRecords" width="300" target="click" :content="item.revisedRecords">
                    <i slot="reference" class="iconfont icon-i-dingdanxinxi"></i> </el-popover
                ></el-col>
                <el-col :span="3">
                  <div class="operation-icon">
                    <i class="iconfont icon-chakan icon-edit" @click="goRoutePath('/basisBank/basisDetail', item.id)">查看</i>
                    <i class="iconfont icon-shiyongxiangmu" @click="openDialog(item)">适用项目</i>
                  </div>
                </el-col>
              </el-row> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column width="210" label="业务类别">
          <template slot-scope="scope">{{ scope.row.businessCategoryName }}</template>
        </el-table-column>
        <el-table-column width="150" label="版本时间">
          <template slot-scope="scope">{{ scope.row.versionTimeStr }}</template>
        </el-table-column>
        <el-table-column label="修订记录" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.revisedRecords }}</template>
        </el-table-column>
        <el-table-column prop="revisedRecords" width="50">
          <template slot-scope="scope">
            <el-popover v-if="scope.row.revisedRecords" width="300" target="click" :content="scope.row.revisedRecords">
              <i slot="reference" class="iconfont icon-i-dingdanxinxi"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="270">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-chakan icon-edit" @click="goRoutePath('/basisBank/basisDetail', scope.row.id, 'view')"
                >查看</i
              >
              <!-- <i class="iconfont icon-chakan icon-edit" @click="goCheckList(scope.row.id)">检查表</i> -->
              <i class="iconfont icon-fuzhi icon-edit" @click="copyBasis(scope.row.id)">复制</i>
              <i class="iconfont icon-xiugai icon-edit" @click="goRoutePath('/basisBank/basisDetail', scope.row.id, 'edit')"
                >编辑</i
              >
              <i class="iconfont icon-shiyongxiangmu" @click="openDialog(scope.row)">适用项目</i>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="releaseMechanism" label="拥有人">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.releaseMechanism" :keyWords="form.keyWords"></highlight-words>
            </template>
        </el-table-column>-->
      </el-table>
      <pagniation
        :totalPage="totalPage"
        :currentPage="form.current"
        :totalNum="totalNum"
        @changePage="handleChangePage"
      ></pagniation>
      <el-dialog
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        width="30%"
        :title="action === 'create' ? '新增依据' : action === 'copy' ? '复制依据' : '编辑依据'"
      >
        <el-form ref="ruleForm" :model="basisDetail" :rules="rules" label-position="top">
          <!-- <el-form-item label="名称" prop="name">
            <el-input v-model="basisDetail.name" placeholder="名称" clearable></el-input>
          </el-form-item>-->
          <el-form-item label="业务类别" prop="businessCategoryIds">
            <el-cascader
              :options="categories"
              v-model="basisDetail.businessCategoryIds"
              filterable
              clearable
              :props="{ label: 'name', children: 'childList', value: 'id' }"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">{{
            action === "create" ? "下一步" : action === "copy" ? "下一步" : "确定"
          }}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="synchronizedDialog"
        :close-on-click-modal="false"
        width="50%"
        :title="step === 'ONE' ? '同步记录' : '依据同步'"
      >
        <el-table :data="synchronizedList" v-show="step === 'ONE'">
          <el-table-column label="触发时间" prop="triggerTime" width="120"></el-table-column>
          <el-table-column label="记录内容" prop="synchronizationInfo" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.synchronizationInfo }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-tongbu" style="cursor: pointer;" @click="choiseSynchronized(scope.row)">依据同步</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="step === 'TWO'">
          <div class="synchronizedTitle">{{ curItem.synchronizationInfo }}</div>
          <div style="padding:1em;">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
              >同步的业务类别</el-checkbox
            >
          </div>
          <div class="synchronizedContent">
            <el-checkbox-group v-model="synchronized.basisLibraryIds" @change="handleCheckedChange">
              <el-checkbox
                v-for="(item, index) in curItem.basisLibraryIdAndNameDtoList"
                :label="item.basisLibraryId"
                :key="index"
                >{{ item.basisLibraryName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <span style="color:#999999">PS：当前仅支持同步标准号/发布号与标准法规的名称。</span>
        </div>
        <span slot="footer" class="dialog-footer" v-show="step === 'TWO'">
          <el-button @click="synchronizedDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveSynchronization">同 步</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="applyDialog" :close-on-click-modal="false" width="50%" title="版本依据">
        <el-table :data="[curItem]">
          <el-table-column label="业务类别">
            <template slot-scope="scope">{{ scope.row.businessCategoryName }}</template>
          </el-table-column>
          <el-table-column label="版本时间">
            <template slot-scope="scope">{{ scope.row.versionTimeStr }}</template>
          </el-table-column>
          <el-table-column label="修订记录">
            <template slot-scope="scope"
              ><el-popover placement="top" width="300" :content="scope.row.revisedRecords" trigger="click">
                <i class="iconfont icon-i-dingdanxinxi" slot="reference"></i> </el-popover
            ></template>
          </el-table-column>
        </el-table>
        <div style="padding:1em 0;">
          <h4>请选择适用该版本依据的项目</h4>
          <br />
          <div>
            在
            <el-date-picker
              v-model="projectForm.startDate"
              size="small"
              type="date"
              value-format="timestamp"
              placeholder="开始时间"
            >
            </el-date-picker>
            至
            <el-date-picker
              v-model="projectForm.endDate"
              size="small"
              type="date"
              value-format="timestamp"
              placeholder="结束时间"
            >
            </el-date-picker>
            时间段内执行的项目&nbsp;&nbsp;&nbsp;
            <el-button size="small" type="primary" @click="getBasisProjects">筛选</el-button>
          </div>
        </div>
        <el-table @selection-change="handleSelectionChange" :data="projectList" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column>
          <el-table-column label="状态" prop="used" width="80">
            <template slot-scope="scope">{{ scope.row.used ? "禁选" : "可选" }}</template>
          </el-table-column>
          <el-table-column label="执行时间" prop="executionDate" width="140">
            <template slot-scope="scope">{{ scope.row.executionDate | formatDate("yyyy-MM-dd hh:mm") }}</template>
          </el-table-column>
          <el-table-column label="项目名称" prop="projectName"></el-table-column>
          <el-table-column label="企业名称" prop="companyName"></el-table-column>
          <el-table-column label="委托受理编号" prop="entrustNumber" width="140"></el-table-column>
        </el-table>
        <pagniation
          :totalPage="projectTotalPage"
          :totalNum="projectTotalNum"
          @changePage="handleProjectChangePage"
        ></pagniation>
        <span slot="footer" class="dialog-footer">
          <el-button @click="applyDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveApply">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import cityes from "@/components/tools/Cityes.vue";
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import selectTree from "@/components/tools/selectTree.vue";
import { mapGetters } from "vuex";
export default {
  name: "checkList",
  components: {
    highlightWords,
    SearchBox,
    selectTree,
    pagniation,
    preview,
    cityes
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      label: {},
      dataList: [],
      categories: [],
      isIndeterminate: false,
      synchronizedDialog: false,
      applyDialog: false,
      checkAll: false,
      step: "ONE",
      synchronized: {
        basisLibraryIds: [],
        literatureId: ""
      },
      curItem: {},
      synchronizedList: [
        {
          basisLibraryIdAndNameDtoList: [
            {
              basisLibraryId: "string",
              basisLibraryName: "string"
            }
          ],
          literatureId: "string",
          literatureName: "string",
          synchronizationInfo: "string",
          time: 0,
          triggerTime: "string"
        }
      ],
      listData: [],
      totalPage: 0,
      totalNum: 0,
      action: "create",
      curId: "",
      basisDetail: {
        businessClassification: "",
        businessCategoryIds: []
      },
      rules: {
        businessClassification: { required: true, message: "必填" },
        businessCategoryIds: { required: true, message: "必填" }
      },
      cities: [],
      materialList: [],
      projectList: [],
      projectTotalPage: 0,
      projectForm: {
        pageSize: 30,
        current: 0,
        startDate: "",
        endDate: ""
      },
      projectTotalNum: 0,
      showDialog: false,
      isClear: false,
      form: { pageSize: 30, current: 0, businessClassificationIds: [] }
    };
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
      }
    },
    $route: {
      handler() {
        this.getDataList();
      }
    }
  },
  activated() {
    this.getDataList();
    this.getCategories();
    //this.getCitys();
    this.getMaterialList();
    this.getNeedSynchronization();
  },
  
  created() {
    this.getDataList();
    this.getCategories();
    //this.getCitys();
    this.getMaterialList();
    this.getNeedSynchronization();
  },
  methods: {
    canSelect(row, index) {
      return !row.used;
    },
    handleSelectionChange(val) {
      this.listData = val.map(item => {
        if (!item.used) {
          return item;
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.used) {
        return "disabledClass";
      }
      return "";
    },
    //分页组件改变页码
    handleProjectChangePage(page) {
      this.projectForm.pageSize = page.pageSize;
      this.projectForm.current = page.currentPage - 1;
      this.getBasisProjects();
    },
    getBasisProjects() {
      this.$http.basisBankService.getBasisProjects(this.curItem.id, this.projectForm).then(res => {
        this.projectList = res.data.content;
        this.projectTotalPage = res.data.totalPages;
        this.projectTotalNum = res.data.totalElements;
      });
    },
    saveApply() {
      this.$http.basisBankService
        .saveConnection(this.curItem.id, {
          listData: this.listData.map(item => {
            return item.identifier;
          })
        })
        .then(res => {
          this.applyDialog = false;
          this.projectList = [];
          this.projectTotalPage = 0;
          this.projectTotalNum;
        });
    },
    openDialog(item) {
      this.listData = [];
      this.projectList = [];
      this.curItem = item;
      this.applyDialog = true;
    },
    handleCheckAllChange(val) {
      this.synchronized.basisLibraryIds = val
        ? this.curItem.basisLibraryIdAndNameDtoList.map(item => {
            return item.basisLibraryId;
          })
        : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.curItem.basisLibraryIdAndNameDtoList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.curItem.basisLibraryIdAndNameDtoList.length;
    },
    getCategorieByTypeForm() {
      let result = this.categories.find(item => {
        if (item.id === this.form.businessClassificationId) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    getNeedSynchronization() {
      this.$http.basisBankService.getNeedSynchronization({ current: 0, pageSize: 100 }).then(res => {
        this.synchronizedList = res.data.content || [];
      });
    },
    /**
     * 校验表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.action) {
            case "create":
              this.showDialog = false;
              this.goRoutePath("/basisBank/basisDetail", 0, "create", this.basisDetail);
              break;
            case "edit":
              this.doUpdate();
              break;
            case "copy":
              this.doCopy();
              break;
          }
          // this.curId ? this.doUpdate() : this.doCreate();
        } else {
          return false;
        }
      });
    },
    /**
     * 过滤subclass为空
     */
    reload(data) {
      let result = [];
      data.map(item => {
        let { id, name, childList } = item;
        if (childList.length > 0) {
          result.push({
            id: id,
            name: name,
            childList: this.reload(childList)
          });
        } else {
          result.push({
            id: id,
            name: name
          });
        }
      });
      return result;
    },
    doCreate() {
      this.$http.basisBankService
        .createBasisBank(this.basisDetail)
        .then(res => {
          this.$refs["ruleForm"].resetFields();
          this.goRoutePath("/basisBank/basisDetail", res.data);
        })
        .then(this.getDataList);
    },
    doUpdate() {
      this.$http.basisBankService
        .updateBasisBank(this.curId, this.basisDetail)
        .then(this.getDataList)
        .then(() => {
          this.showDialog = false;
          this.goRoutePath("/basisBank/basisDetail", this.curId);
        });
    },
    getMaterialList() {
      this.$http.basisBankService.getMaterialList().then(res => {
        this.materialList = res.data;
      });
    },
    getCitys() {
      this.$http.basisBankService.getCities().then(res => {
        this.cities = this.reload(res.data);
      });
    },
    getCategorieByType() {
      let result = this.categories.find(item => {
        if (item.id === this.basisDetail.businessClassification) {
          return item;
        }
      });
      return result ? result.childList || [] : [];
    },
    /**
     * 获取行业分类
     */
    getCategories() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.categories = res.data.childList;
      });
    },
    //去除类别为空的数组字段
    reloadCategories(data) {
      let result = [];
      data.map(item => {
        let { id, name, childList } = item;
        if (childList.length > 0) {
          result.push({
            id: id,
            name: name,
            childList: this.reloadCategories(childList)
          });
        } else {
          result.push({
            id: id,
            name: name
          });
        }
      });
      return result;
    },
    translateDateTime(row) {
      let abolitionTime = row.abolitionTime || new Date().getTime();
      let now = new Date(abolitionTime);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      if (month < 10) {
        month = "0" + month;
      }
      return year + "-" + month + "-" + date;
    },
    /**
     * 获取分类
     */
    getCategorie(val) {
      this.form.evaluationCategory = val[val.length - 1];
    },
    //选择行业
    getKinds(city, index) {
      this.form.industryCategory = index;
    },
    // getCategories() {
    //   this.$http.basisBankService.getCategories().then(res => {
    //     this.categories = res.data;
    //   });
    // },
    /**
     * 添加新label
     */
    addBewBasis() {
      this.action = "create";
      this.showDialog = true;
      this.basisDetail = {
        businessClassification: "",
        businessCategoryIds: []
      };
      // setTimeout(this.resetSelectTree, 300);
      // this.goRoutePath("/basisBank/basisDetail");
    },
    /**
     * 同步记录
     */
    synchronizedRecord() {
      this.step = "ONE";
      this.synchronizedDialog = true;
      this.synchronized = {
        basisLibraryIds: [],
        literatureId: ""
      };
    },
    choiseSynchronized(item) {
      this.curItem = item;
      this.synchronized.literatureId = item.literatureId;
      this.step = "TWO";
    },
    saveSynchronization() {
      this.$http.basisBankService.saveSynchronization(this.synchronized).then(res => {
        this.synchronizedDialog = false;
        this.step = "THREE";
        this.$notify({
          title: "依据同步成功",
          message: "依据同步成功，已在依据列表生成新版本的依据，请注意查看并确定新版本依据所适用的项目范围！",
          type: "success"
        });
        this.getNeedSynchronization();
      });
    },
    /**
     * 去检查列表
     */
    goCheckList(id) {
      this.goRoutePath("/basisBank/checkList", id);
    },
    /**
     * 复制
     */
    copyBasis(id) {
      this.action = "copy";
      this.curId = id;
      this.showDialog = true;
      this.basisDetail = {
        businessClassification: "",
        businessCategoryIds: []
      };
    },
    doCopy() {
      this.$http.basisBankService.copyBasisBank(this.curId, this.basisDetail).then(res => {
        this.goRoutePath("/basisBank/basisDetail", res.data.id, "edit");
        this.getDataList();
        this.showDialog = false;
      });
    },
    doDelete(id) {
      this.$confirm("是否删除此依据?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.basisBankService.deleteBasisBank(id).then(() => {
          this.$message.success("删除成功");
          this.getDataList();
        });
      });
    },
    /**
     * 编辑
     */
    editBasis(item) {
      this.action = "edit";
      this.curId = item.id;
      this.showDialog = true;
      this.basisDetail = item;
    },
    /**
     * 路由跳转
     */
    goRoutePath(path, id = 0, action = "view", params = { businessCategoryIds: [] }) {
      this.$router.push(path + "/" + id + "?action=" + action + "&businessCategoryIds=" + params.businessCategoryIds.join(","));
    },
    translateStatus(row) {
      return row.status === "ACTIVE" ? "现行" : "作废";
    },
    //重置
    resetForm() {
      this.form.businessClassificationIds = [];
      this.form.businessClassificationId = "";
      this.form.businessCategoryId = "";
      this.form.current = 0;
      this.form.pageSize = 30;
      this.getDataList();
    },
    /**
     * 获取datalist
     */
    getDataList() {
      this.$http.basisBankService
        .getBasisBankList({
          current: this.form.current,
          pageSize: this.form.pageSize,
          businessCategoryId:
            this.form.businessClassificationIds.length != 0
              ? this.form.businessClassificationIds[this.form.businessClassificationIds.length - 1]
              : "",
          businessClassificationId: this.form.businessClassificationId
        })
        .then(res => {
          this.dataList = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * 时间转换函数
     */
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      if (month < 10) {
        month = "0" + month;
      }
      return year + "-" + month + "-" + date;
    }
  }
};
</script>
<style lang="scss" scoped>
.nowrap {
  width: 80%;
  position: relative;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  > span {
    position: absolute;
    right: 0;
  }
  > span:hover {
    color: #1c7eff;
  }
}
.citys {
  position: relative;
}
.synchronizedTitle {
  background-color: #f0f3f5;
  padding: 1em;
}
.synchronizedContent {
  border: 1px solid #e0e0e0;
  padding: 1em;
}
// .blin {
//   outline: 2px;
// }
.blin {
  cursor: pointer;
  animation: glow 300ms ease-out infinite alternate;
}
@keyframes glow {
  0% {
    border-color: #0099ff;
    box-shadow: 0 0 2px rgba(0, 153, 255, 0.6);
  }
  100% {
    border-color: #0099ff;
    box-shadow: 0 0 20px rgba(0, 153, 255, 0.6);
  }
}
</style>
