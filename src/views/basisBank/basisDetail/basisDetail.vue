<template>
  <div>
    <search-box>
      <template slot="input">
        <el-col :span="6">
          <el-form-item label-width="80px" label="业务类别:">{{
            basisDetail.businessCategoryName || getBusinessCategoryName()
          }}</el-form-item>
        </el-col>
        <el-col :span="6">
          &nbsp;
        </el-col>
        <el-col :span="6">
          &nbsp;
        </el-col>
        <el-col :span="6">
          &nbsp;
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="50px" align="left" label="类型">
            <el-select v-model="form.literatureType" size="small" @change="getDataList(true)">
              <el-option value="ALL" label="全部"></el-option>
              <el-option value="STATUTE" label="法规"></el-option>
              <el-option value="STANDARD" label="标准"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签筛选" label-width="80px">
            <el-select
              v-model="form.labelIds"
              multiple
              filterable
              remote
              reserve-keyword
              collapse-tags
              size="small"
              placeholder="请输入关键词"
              style="width:100%"
              :remote-method="getTags"
            >
              <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="80px" align="left" label="关键字">
            <el-input v-model="form.keyWords" size="small" placeholder="请输入关键字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList(true)">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="detailBox regulation-tb box-style_common">
      <div class="tools-bar_common">
        <span class="table-title">依据待选列表</span>
        <div>
          <el-button size="small" type="primary" style="float:right" v-if="action != 'view'" @click="openDialog"
            >提交</el-button
          >
        </div>
      </div>
      <el-table :data="dataList" height="450">
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
        <el-table-column label="内容" prop="content"></el-table-column>
        <el-table-column label="物质标签" width="200" prop="materialLabelNames">
          <template slot-scope="scope" show-overflow-tooltip>
              {{scope.row.materialLabelNames.join(",")}}
          </template>
        </el-table-column>
        <el-table-column label="行业标签" width="200" prop="industryLabelNames">
          <template slot-scope="scope" show-overflow-tooltip>
              {{scope.row.industryLabelNames.join(",")}}
          </template>
        </el-table-column>
        <el-table-column label="自定义标签" width="200" prop="customLabelNames" show-overflow-tooltip>
          <template slot-scope="scope">
              {{scope.row.customLabelNames.join(",")}}
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" prop="customLabelNames">
          <template slot-scope="scope">
            {{ scope.row.literatureType === "STANDARD" ? "标准" : "法规" }}
          </template>
        </el-table-column>
        <el-table-column label="操作"  fixed="right" width="120px" v-if="action != 'view'">
          <template slot-scope="scope">
            <div class="operation-icon">
              <el-button size="small" v-if="checkHas(scope.row.id)" @click="doAdd(scope.row)">添加</el-button>
              <el-button size="small" v-else type="primary" @click="remove(scope.row)">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation :totalPage="totalPage":currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
    </div>
    <el-dialog title="修订记录" :visible.sync="showDialog" :close-on-click-modal="false" width="30%">
      <el-form ref="ruleForm" :model="basisDetail" label-position="top">
        <!-- <el-form-item label="名称" prop="name">
            <el-input v-model="basisDetail.name" placeholder="名称" clearable></el-input>
          </el-form-item>-->
        <el-form-item label="版本时间">
          <span>{{ new Date() | formatDate("yyyy-MM-dd") }}</span>
        </el-form-item>
        <el-form-item label="修订内容" prop="revisedRecords" :rules="{ required: true, message: '必填', target: 'blur' }">
          <el-input type="textarea" maxlength="200" :rows="3" v-model="basisDetail.revisedRecords" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityes from "@/components/tools/Cityes.vue";
import selectTree from "@/components/tools/selectTree.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters, mapActions } from "vuex";
import { setTimeout } from "timers";
export default {
  name: "basisDetail",
  components: { cityes, selectTree, SearchBox, pagniation },
  data() {
    return {
      categories: [],
      form: {
        keyWords: "",
        pageSize: 30,
        auditState: "SUCCESS",
        literatureType: "ALL",
        current: 0,
        labelIds: []
      },
      action: "",
      basisBankId: "",
      tags: [],
      dataList: [],
      showDialog: false,
      standarItem: {
        alternativeStandardNo: "",
        implementTime: 0,
        originalAddress: "",
        releaseMechanism: "",
        releaseTime: 0,
        standardName: "",
        standardNo: "",
        standardState: ""
      },
      statuteItem: {
        abolitionTime: 0,
        effectTime: 0,
        industryClassification: "",
        originalAddress: "",
        postNo: "",
        rangeApplication: "",
        releaseMechanism: "",
        releaseTime: 0,
        statuteDescription: "",
        statuteName: "",
        style: ""
      },
      cities: [],
      materialList: [],
      totalNum: 0,
      totalPage: 0,
      action: this.$route.query.action,
      evaluationCategory: [],
      basisDetail: {
        businessCategoryIds: this.$route.query.businessCategoryIds.split(","),
        businessClassification: this.$route.query.businessClassification,
        businessClassificationName: "",
        businessCategoryName: "",
        literatureIdentifierAndIdList: [],
        revisedRecords: ""
      },
      isClear: false
    };
  },
  watch: {
    "form.keyWords": {
      handler(val) {
        this.getDataList(true);
      }
    },
    "form.labelIds": {
      handler(val) {
        this.getDataList(true);
      }
    },
    $route(val) {
      this.action = val.query.action;
      this.basisDetail.businessCategoryIds=this.$route.query.businessCategoryIds?this.$route.query.businessCategoryIds.split(","):[];
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  activated() {
    this.getCategories();
    this.getRouteParams();
    this.initBasisDetail();
    this.getMaterialList();
    // this.getCitys();
    this.getDataList();
    this.basisDetail.businessCategoryIds=this.$route.query.businessCategoryIds.split(",");
    this.action = this.$route.query.action;
  },
  methods: {
    ...mapActions["deleteTagsByPath"],
    getTags(query) {
      if (query !== "") {
        this.$http.labelBankService.getLabel({ keywords: query }).then(res => {
          this.tags = res.data;
        });
      } else {
        this.tags = [];
      }
    },
    getBusinessCategoryName() {
      this.findCategory(this.categories, this.basisDetail.businessCategoryIds[0] , JSON.parse(JSON.stringify(this.basisDetail.businessCategoryIds)));
    },
    findCategory(data, id = 0, list = []) {
      if (data.length === 0) {
        return;
      }
      let obj = data.find(item => {
        if (item.id === id) {
          this.basisDetail.businessCategoryName = item.name;
          return item;
        }
      });
      id = list[0];
      list = list.splice(0, 1);
      if (obj && obj.childList) this.findCategory(obj.childList, id, list);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showDialog = false;
          this.save();
          // this.curId ? this.doUpdate() : this.doCreate();
        } else {
          return false;
        }
      });
    },
    openDialog() {
      this.showDialog = true;
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    doAdd(item) {
      this.basisDetail.literatureIdentifierAndIdList.push({
        literatureId: item.id,
        literatureIdentifier: item.identifier
      });
    },
    remove(jtem) {
      let index = this.basisDetail.literatureIdentifierAndIdList.findIndex(item => {
        if (item.literatureId === jtem.id) {
          return item;
        }
      });
      this.basisDetail.literatureIdentifierAndIdList.splice(index, 1);
    },
    checkHas(id) {
      let index = this.basisDetail.literatureIdentifierAndIdList.findIndex(item => {
        if (item.literatureId === id) {
          return item;
        }
      });
      return index === -1;
    },
    addBasis(j) {
      let index = this.basisDetail[this.form.literatureType].findIndex(item => item.id === j.id);
      if (index === -1) {
        this.basisDetail[this.form.literatureType].push(j);
      } else {
        this.basisDetail[this.form.literatureType].splice(index, 1);
      }
    },
    isChoise(id) {
      let index = this.basisDetail[this.form.literatureType].findIndex(item => item.id === id);
      return index === -1 ? false : true;
    },
    getMaterialList() {
      this.$http.basisBankService.getMaterialList().then(res => {
        this.materialList = res.data;
      });
    },
    getCitys() {
      this.$http.basisBankService.getCities().then(res => {
        this.cities = res.data;
      });
    },
    getCategoryTypeTreeSet(node) {
      return { label: node.name, children: node.childList, value: node.id };
    },
    /**
     * 获取行业分类
     */
    getCategories() {
      this.$http.advisoryCategoryService
        .getAdvisoryCategoryTree().then(res => {
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
    getCategorieByType() {
      let result = this.categories.find(item => {
        if (item.id === this.basisDetail.categoryType) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    /**
     * 保存
     */
    save() {
      this.action === "create" ? this.createBasisBank() : this.updateBasisBank();
    },
    createBasisBank() {
      this.$http.basisBankService.createBasisBank(this.basisDetail).then(() => {
        //清除对应tags
        this.$store.commit({
          type: "tag_deleteTags",
          path: this.$route.path
        });

        this.$router.push("/basisBank/basisList");
      });
    },
    updateBasisBank() {
      this.$http.basisBankService.updateBasisBank(this.basisBankId, this.basisDetail).then(() => {
        //清除对应tags
        this.$store.commit({
          type: "tag_deleteTags",
          path: this.$route.path
        });

        this.$router.push("/basisBank/basisList");
      });
    },
    /**
     * 查看
     */
    goStandarOrStatute(id) {
      this.form.literatureType === "STATUTE"
        ? this.$router.push(`/statuteBank/regulationEdit/${id}`)
        : this.$router.push(`/standardBank/standardEntry/see/${id}`);
    },
    /**
     * 判断是否选中
     */
    isActive(item) {
      return this.form.labelIds.findIndex(e => e === item.labelName) != -1 ? "active" : "";
    },
    /**
     * 添加或者移除标签
     */
    addOrRemoveTag(item) {
      let index = this.form.labelIds.findIndex(e => e === item.labelName);
      if (index != -1) {
        this.form.labelIds.splice(index, 1);
      } else {
        this.form.labelIds.push(item.labelName);
      }
    },
    //重置
    resetForm() {
      this.form.keyWords = "";
      this.form.labelIds = [];
      this.form.literatureType = "ALL";
      this.form.pageSize = 10;
      this.form.current = 0;
      this.getDataList();
    },
    getDataList(flag = false) {
      if (flag) {
        this.form.current = 0;
      }
      this.multipleSelection = [];
      // let {
      //   keywords,
      //   pageSize,
      //   statuteName,
      //   auditState,
      //   current,
      //   labelIds
      // } = this.form;
      // this.form.literatureType = this.form.type === "statutes" ? "STATUTE" : "STANDARD";
      if (this.action === "view") {
        this.$http.basisBankService.getLiteratureView(this.basisBankId, this.form).then(res => {
          this.dataList = res.data.content;
          this.totalNum = res.data.totalElements;
          this.totalPage = res.data.totalPages;
        });
      } else {
        this.$http.basisBankService.getLiteratureType(this.form).then(res => {
          this.dataList = res.data.content;
          this.totalNum = res.data.totalElements;
          this.totalPage = res.data.totalPages;
        });
      }
    },
    //选择行业
    getKinds(city, bind) {
      this.basisDetail.industryCategory = bind;
    },
    /**
     * 获取route上的参数
     */
    getRouteParams() {
      this.basisBankId = this.$route.params.id;
    },
    /**
     * 初始化basis
     */
    initBasisDetail() {
      if (this.basisBankId === "0") {
        this.basisDetail = {
          businessCategoryIds: this.$route.query.businessCategoryIds.split(","),
          businessClassification: this.$route.query.businessClassification,
          businessClassificationName: "",
          businessCategoryName: "",
          literatureIdentifierAndIdList: [],
          revisedRecords: ""
        };
      } else {
        this.getBasisDetail();
      }
    },
    /**
     * 获取详细内容
     */
    getBasisDetail() {
      this.$http.basisBankService.getBasisBankById(this.basisBankId).then(res => {
        this.basisDetail = res.data;
        this.basisDetail.revisedRecords = "";
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.detailBox {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 1em;
  box-sizing: border-box;
}
.tagBox {
  padding: 1em;
  box-sizing: border-box;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
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
</style>
