<template>
  <div>
    <search-box :from="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item prop="businessCategoryType">
            <template slot="label"
              ><span style="color:red">*</span>业务类别</template
            >
            <el-cascader
              :options="categoriesList"
              clearable
              :show-all-levels="false"
              @change="getDataList(true)"
              v-model="form.evaluationCategoryList"
              :props="{ label: 'name', children: 'childList', value: 'id' }"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title"
          >版本关联 <span style="font-size:12px;color:#999999">（PS：项目模板版本配置唯一的报告模板版本）</span></h5
        >
      </div>
      <el-table :data="dataList">
        <template slot="empty">
          <br />
          <br />
          <img src="@/assets/empty.png" />
          <br />
          <span>暂无数据，请选择业务类别搜索对应的模板!</span>
          <br />
          <br />
          <br />
          <br />
        </template>
        <el-table-column label="项目模板版本时间" width="120" prop="publishDate">
          <template slot-scope="scope">
            {{ scope.row.publishDate | formatDate("yyyy-MM-dd hh:mm") }}
          </template>
        </el-table-column>
        <el-table-column label="项目模板修订记录" prop="log">
          <template slot-scope="scope">
            <span class="nowrap" :title="scope.row.log"> {{ scope.row.log }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="log" width="50">
          <template slot-scope="scope">
            <el-popover target="click" width="300" :content="scope.row.log">
              <i slot="reference"><span class="iconfont icon-i-dingdanxinxi"></span></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="报告模板版本时间" width="120" prop="reportTemplateVersion">
          <template slot-scope="scope">
            <span v-if="scope.row.reportTemplateVersion">{{
              scope.row.reportTemplateVersion.publishDate | formatDate("yyyy-MM-dd hh:mm")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报告模板修订记录" prop="reportTemplateVersion">
          <template slot-scope="scope">
            <span v-if="scope.row.reportTemplateVersion" class="nowrap" :title="scope.row.reportTemplateVersion.log">
              {{ scope.row.reportTemplateVersion ? scope.row.reportTemplateVersion.log : "" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="reportTemplateVersion" width="50">
          <template slot-scope="scope">
            <el-popover v-if="scope.row.reportTemplateVersion" width="300" target="click" :content="scope.row.reportTemplateVersion.log">
              <i slot="reference" class="iconfont icon-i-dingdanxinxi"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作"  fixed="right" width="100">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-guanlian2" @click="relation(scope.row)">关联</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation :totalPage="totalPage" :currentPage='form.current' ref="datalist" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
    </div>
    <el-dialog :visible.sync="visible" title="修订记录" width="30%">
      <div class="content">
        {{ showContent }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="relationBox" title="关联报告模板" width="50%">
      版本时间:
      <el-date-picker
        size="medium"
        v-model="reportForm.dateTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      &nbsp;&nbsp;
      <el-button type="primary" size="small" icon="el-icon-search" @click="getReportList()">筛选</el-button>
      <br /><br />
      <!-- <search-box :form="form">
        <template slot="input">
          <el-col :span="6">
            <el-form-item label="版本时间">
              <el-date-picker
                size="medium"
                v-model="reportForm.dateTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="6">
          </el-col>
        </template>
      </search-box> -->
      <el-table border :close-on-click-modal="false" :data="reportList" height="300" class="relation-tb-box" size="mini">
        <el-table-column label=" " width="40" align="center">
          <template slot-scope="scope">
            <el-radio v-model="choiseId" size="medium" :label="scope.row.id"><span style="color:white"></span></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="版本时间" width="120" prop="publishDate">
          <template slot-scope="scope">
            {{ scope.row.publishDate | formatDate("yyyy-MM-dd hh:mm") }}
          </template>
        </el-table-column>
        <el-table-column label="修订记录" prop="log">
          <template slot-scope="scope">
            <span class="nowrap"> {{ scope.row.log }}</span>
          </template>
        </el-table-column>
        <el-table-column width="50" prop="log">
          <template slot-scope="scope">
            <el-popover target="click" width="300" :content="scope.row.log">
              <i slot="reference" class="iconfont icon-i-dingdanxinxi"></i>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <pagniation
        :totalPage="reportTotalPage"
        ref="project"
        :totalNum="reportTotalNum"
        @changePage="handleChangeReportPage"
      ></pagniation>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relationBox = false" size="medium">取 消</el-button>
        <el-button type="primary" :disabled="!choiseId" @click="save" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchBox from "@/components/tools/searchBox.vue";
import pagniation from "@/components/tools/Pagniation.vue";
export default {
  name:'relation',
  data() {
    return {
      categoriesList: [],
      categoryList: [],
      reportList: [],
      dataList: [],
      totalPage: 0,
      totalNum: 0,
      reportTotalPage: 0,
      reportTotalNum: 0,
      visible: false,
      choiseId: "",
      relationBox: false,
      showContent: "",
      curId: "",
      form: { current: 0, pageSize: 30, businessCategoryType: "", evaluationCategoryList: [] },
      reportForm: {
        current: 0,
        pageSize: 30,
        dateTime: null,
        startDate: "",
        endDate: "",
        businessCategoryType: "",
      }
    };
  },
  components: { SearchBox, pagniation },
  activated() {
    this.getCatogoryList();
  },
  methods: {
    getCategorieByTypeForm() {
      let result = this.categoriesList.find(item => {
        if (item.id === this.form.businessCategory) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    save() {
      this.$http.reportService
        .saveRelation(this.curId, { reportTemplateVersionId: this.choiseId })
        .then(() => {
          this.$message.success("关联成功");
          this.relationBox = false;
        })
        .then(this.getDataList);
    },
    relation(item) {
      this.curId = item.id;
      this.choiseId = item.reportTemplateVersion ? item.reportTemplateVersion.identifier : "";
      this.relationBox = true;
      this.getReportList();
    },
    showDetail(content) {
      this.visible = true;
      this.showContent = content;
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    handleChangeReportPage(page) {
      this.reportForm.pageSize = page.pageSize;
      this.reportForm.current = page.currentPage - 1;
      this.getReportList();
    },
    getDataList() {
      this.form.businessCategoryType = this.form.evaluationCategoryList
        ? this.form.evaluationCategoryList[this.form.evaluationCategoryList.length - 1]
        : "";
      if (!this.form.businessCategoryType) {
        return;
      }
      this.$http.reportService.getRelationList(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    getReportList() {
      this.reportForm.startDate = this.reportForm.dateTime ? new Date(this.reportForm.dateTime[0]).getTime() : "";
      this.reportForm.endDate = this.reportForm.dateTime ? new Date(this.reportForm.dateTime[1]).getTime() : "";
      this.reportForm.businessCategoryType = this.form.businessCategoryType;
      this.$http.reportService.getReportList(this.reportForm).then(res => {
        this.reportList = res.data.content;
        this.reportTotalPage = res.data.totalPages;
        this.reportTotalNum = res.data.totalElements;
      });
    },
    resetForm() {
      this.form = { current: 0, pageSize: 30, businessCategoryType: "",  evaluationCategoryList: [] };
      this.dataList = [];
      this.totalPage = 0;
      this.totalNum = 0;
    },
    getCatogoryList() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        
        this.categoriesList = res.data.childList;
      });
    },
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
    getCategorieByType(type = "") {
      let result = this.categoriesList.find(item => {
        if (item.id === type) {
          return item;
        }
      });
      return result ? result.childList : [];
    }
  }
};
</script>
<style scoped>
.relation-tb-box >>> .el-radio__label {
  padding-left: 0;
}
</style>
<style lang="scss" scoped>
.content {
  padding: 1em;
  box-sizing: border-box;
  background-color: #f0f3f7;
  color: #344152;
  border-radius: 6px;
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
