<template>
  <div class="takeExample">
    <search-box :from="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="业务类别" prop="businessCategory">
            <el-select
              v-model="form.businessCategory"
              ref="businessCategory"
              size="small"
              style="width:100%"
              placeholder="请选择业务类别"
            >
              <el-option
                v-for="item of categoriesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
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
        <h5 class="tb-title">采样方式列表</h5>
        <div style="float: right;margin-right: 15px;">
          <el-button
            v-if="checkAuth('RBAC_PERMISSION_api_app_samplingMethod_POST')"
            type="success"
            size="small"
            class="entry-btn"
            icon="el-icon-plus"
            @click="createExample"
            >新增采样方式</el-button
          >
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
        <el-table-column prop="categoryName" label="业务类别"></el-table-column>
        <el-table-column prop="name" label="采样方式名称"></el-table-column>
        <el-table-column prop="describe" label="描述"></el-table-column>
        <el-table-column label="启用" width="80">
          <template slot-scope="scope">
            <el-checkbox
              :disabled="!checkAuth('RBAC_PERMISSION_api_app_samplingMethod_changeState_{identifier}_PUT')"
              :checked="isChecked(scope.row.enableOrDisable)"
              @change="checked(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i
                title="编辑"
                class="iconfont icon-xiugai"
                @click="editItem(scope.row)"
                v-if="checkAuth('RBAC_PERMISSION_api_app_samplingMethod_{identifier}_PUT')"
                >编辑</i
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="showBox" :title="curId ? '编辑采样方式' : '新增采样方式'">
      <el-form ref="form" :rules="rule" :model="example" label-position="top">
        <el-form-item label="业务类别" prop="categoryId">
          <el-select
            v-model="example.categoryId"
            size="small"
            style="width:100%"
            placeholder="请选择业务类别"
            :disabled="curId !== ''"
          >
            <el-option v-for="item of categoriesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采样方式名称" prop="name">
          <el-input v-model="example.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="descript">
          <el-input v-model="example.describe" type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBox = false">取消</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  name: "samplingMethod",
  components: { SearchBox },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      dataList: [],
      curId: "",
      showBox: false,
      rule: {
        name: { required: true, message: "必填" },
        categoryId: { required: true, message: "必填" }
      },
      example: {
        describe: "",
        name: "",
        categoryId: "",
        businessClassification: []
      },
      categoryList: [],
      categoriesList: [],
      form: {
        categoryType: "",
        businessClassification: "",
        businessCategory: "",
        evaluationCategory: []
      }
    };
  },
  watch: {
    showBox(val) {
      if (!val) {
        this.$refs["form"].resetFields();
      }
    },
    "form.businessClassification": {
      handler(val) {
        this.form.businessCategory = "";
      }
    }
  },
  activated() {
    this.getDataList();
    this.getCatogoryList();
  },
  methods: {
    getCategorieByType(type = "") {
      let result = this.categoriesList.find(item => {
        if (item.id === type || item.id === this.example.businessClassification) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    isChecked(status) {
      return status === "ENABLE" ? true : false;
    },
    has(str1 = "", str2 = "") {
      if (!str1) {
        return false;
      }
      return str1.indexOf(str2) !== -1 ? true : false;
    },
    checked(item) {
      this.$http.takeExampleService
        .updateState(item.id, item.enableOrDisable === "ENABLE" ? "DISABLE" : "ENABLE")
        .then(this.getDataList);
    },
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.curId ? this.update() : this.create();
        }
      });
    },
    getCatogoryList() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.categoryList = res.data.map(item => ({
          id: item.id,
          name: item.name
        }));
        this.categoriesList = res.data.childList;
        // this.reloadCategories(res.data).map(item => {
        //   this.categoryList = this.categoryList.concat(item.childList || []);
        // });
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
    create() {
      this.$http.takeExampleService.create(this.example).then(() => {
        this.getDataList();
        this.showBox = false;
      });
    },
    update() {
      this.$http.takeExampleService.update(this.curId, this.example).then(() => {
        this.getDataList();
        this.showBox = false;
      });
    },
    editItem(item) {
      this.curId = item.id;
      this.example = item;
      this.showBox = true;
    },
    createExample() {
      this.curId = "";
      this.example = {
        describe: "",
        name: "",
        categoryId: ""
      };
      this.showBox = true;
    },
    getDataList() {
      this.$http.takeExampleService.getList(this.form).then(res => {
        this.dataList = res.data;
      });
    },
    resetForm() {
      this.form.businessClassification = "";
      this.form.businessCategory = "";
      this.getDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.gray {
  position: absolute;
  right: 0;
  font-size: 12px;
  color: #68788c;
}
</style>
