<template>
  <div>
    <search-box :from="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="关键词">
            <el-input v-model="form.name" size="medium" placeholder="关键词" @keyup.enter.native="getDataList" clearable></el-input>
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
      </template> -->
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">公式列表</h5>
      </div>
      <el-table :data="dataList">
        <el-table-column label="类别" prop="formulaType" width="180">
          <template slot-scope="scope">{{scope.row.formulaType==='BUSINESS'?'业务':'基础'}}公式</template>
        </el-table-column>
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column prop="expression" label="公式表达式">
          <template slot-scope="scope">
            <img :src="scope.row.image"/>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="id" label="操作" width="100">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i
                class="iconfont icon-qiyong"
                v-if="!scope.row.enabled"
                @click="setStatus(scope.row.id,'enable')"
              >启用</i>
              <i
                class="iconfont icon-tingyong"
                v-if="scope.row.enabled"
                @click="setStatus(scope.row.id,'disable')"
              >停用</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  name: "formula",
  data() {
    return {
      dataList: [],
      form: { predicate: "" }
    };
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  components: { SearchBox },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$http.formulaService.getList(this.form).then(res => {
        this.dataList = res.data;
      });
    },
    resetForm() {
      this.form.name = "";
      this.getDataList();
    },
    setStatus(id, status) {
      this.$http.formulaService
        .update(id, status)
        .then(() => {
          this.$message.success("操作成功");
        })
        .then(this.getDataList);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
