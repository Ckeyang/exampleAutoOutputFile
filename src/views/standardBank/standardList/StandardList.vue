/* * @Author: yinjie * @Date: 2018-07-17 09:57:46 * @Last Modified by: yinjie * @Last Modified time: 2018-09-12 14:53:33
*/
<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="5">
          <el-form-item label="状态" label-width="50px">
            <el-select v-model="form.literatureState" @change="advancedSearch" style="width:100%">
              <el-option value="ALL" label="全部"></el-option>
              <el-option value="UPCOMING_IMPLEMENT" label="即将实施"></el-option>
              <el-option value="CURRENT" label="现行"></el-option>
              <el-option value="INVALID" label="作废"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="关键字" label-width="70px">
            <el-input
              v-model="form.keyWords"
              placeholder="名称/标准号/发布机构"
              clearable
              @keyup.enter.native="advancedSearch"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box btn-float_right'>
          <el-button type="primary" size="small" icon="el-icon-search" @click="advancedSearch">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">标准列表</h5>
      </div>
      <vxe-table :data="tableData" 
      style="width: 100%" 
      :max-height='winHeight - 326'
      show-header-overflow
      show-overflow
      highlight-hover-row>
        <vxe-table-column type="index" width="80" title="序号"></vxe-table-column>
        <vxe-table-column field="name" title="名称" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="light"
              :content="scope.row.name"
              placement="bottom-start"
            >
              <highlight-words :text="scope.row.name" :keyWords="form.keyWords"></highlight-words>
            </el-tooltip>
          </template>
        </vxe-table-column>
        <vxe-table-column field="identifyCode" title="标准号" width="250" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <highlight-words :text="scope.row.identifyCode" :keyWords="form.keyWords"></highlight-words>
          </template> -->
        </vxe-table-column>
        <vxe-table-column  title="发布机构" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.publishingAgencies.join('、')}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="implementationTime" title="实施时间" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.implementationTime | formatDate("yyyy-MM-dd") }}
          </template>
        </vxe-table-column>
        <vxe-table-column title="替代标准号" width="250" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.alternativeIdentifyCodes.join('、') }}</template>
        </vxe-table-column>
        <vxe-table-column field="type" title="状态" width="90">
          <template slot-scope="scope">
            <span>{{
              scope.row.literatureState === "UPCOMING_IMPLEMENT"
                ? "即将实施"
                : scope.row.literatureState === "CURRENT"
                ? "现行"
                : "作废"
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-citiao icon-edit" @click="toWords(scope.row.id)">词条</i> 
              <i class="iconfont icon-yuanjian icon-edit">
                <preview :url="scope.row.originalAddress" name="原件"></preview>
              </i>
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
      <pagniation
        :totalPage="totalPage"
        :totalNum="totalNum"
        :currentPage='form.current'
        @changePage="handleChangePage"
      ></pagniation>
    </div>
  </div>
</template>
<script>
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import highlightWords from "@/components/tools/HighlightWords.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  name:'standardList',
  data() {
    return {
      form: {
        keyWords: "",
        pageSize: 30,
        literatureType:'STANDARD',
        labelList: [],
        literatureState: "ALL",
        current: 0
      },
      curId: "",
      tableData: [], //列表数据
      totalNum: "", //总数量
      totalPage: "" //总页数
    };
  },
  components: {
    pagniation,
    preview,
    SearchBox,
    highlightWords
  },
  activated() {
    //路由跳转是否刷新页面，默认不刷新
    this.$route.query.isRefresh && this.getDataList();
  },
  created() {
    this.getDataList();
  },
  methods: {
    //状态转换函数
    auditState(state){
      if(state === 'AUDITING'){
        return '待审核'
      }else if (state === 'FAILED'){
        return '未通过'
      }
      return '已通过'
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
    },
    //搜索
    advancedSearch() {
      this.form.current = 0;
      this.getDataList();
    },
    //重置
    resetForm() {
      this.form = {
        keyWords: "",
        literatureType:'STANDARD',
        pageSize: this.form.pageSize,
        literatureState: "ALL",
        current: 0
      }
      this.getDataList();
    },
    //标准词条
    toWords(id) {
      this.$router.push(`/standardBank/standardWords/${id}`);
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    //获取标准列表
    getDataList() {
      this.$http.standardService.getDataList(this.form).then(res => {
        this.tableData = res.data.content;
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
      });
    }
  }
};
</script>
<style scoped>
.selfDesign {
  color: #26beff;
  border: 1px solid #26beff;
}
.tagLabel {
  font-size: 14px;
  color: #5d687a;
  padding: 1em 0;
}
.chooseTagColor {
  color: #fff;
  background-color: #26beff;
}
.tagColor {
  background-color: #e1eafa;
}
.tagItem {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  min-width: 80px;
  padding: 0.5em 1em;
  font-size: 12px;
  margin: 0 1.1em 1em;
  box-sizing: border-box;
}
.tagLabel {
  font-size: 14px;
  color: #5d687a;
  padding: 1em 0;
}

.chooseTagColor {
  color: #fff;
  background-color: #26beff;
}

.tagColor {
  background-color: #e1eafa;
}

.tagItem {
  display: inline-block;
  text-align: center;
  min-width: 80px;
  padding: 0.5em 1em;
  font-size: 12px;
  margin: 0 1.1em 1em;
  box-sizing: border-box;
}
</style>