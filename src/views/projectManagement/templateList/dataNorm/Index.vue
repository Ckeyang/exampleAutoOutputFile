<template>
  <div style="position:relative" class="content-warp">
    <div class="container-left box-style_common">
      <treeList
        title="设置数据规范"
        @changeNode="getCheckAssembly"
        :data="customTreeData"
        :isCheckedParent="true"
        :expandAll="true"
        :expandOn="false"
        :defaultCheckKey='curCheckedAssemblyId'
        :nameList="['tag']"
      />
    </div>
    <div class="container-right">
      <div class="regulation-tb box-style_common">
        <div class="tools-bar_common">
          <h5 class="table-title">{{$route.params.name}}</h5>
        </div>
        <el-table :data="tableData" style="width: 100%" :max-height="winHeight - 240" highlight-current-row>
          <el-table-column prop="componentAttr.tag" label="字段名"></el-table-column>
          <el-table-column label="数据类型">
            <template
              slot-scope="scope"
            >{{getDataType(scope.row.componentAttr.inputModle.inputType)}}</template>
          </el-table-column>
          <el-table-column label="主键">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.componentAttr.primaryKey"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="数据规范" width="150">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                class="iconfont icon-shezhi"
                @click="openSettingDialog(scope.row.identifier,scope.row.componentAttr.tag)"
                v-show="!scope.row.componentAttr.specification.value"
              >设置规范</i>
              <i
                class="iconfont icon-zidingyibianhao"
                @click="editSetting(scope.row)"
                v-show="scope.row.componentAttr.specification.value"
              >自定义编号</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer-box" v-show="tableData.length">
          <el-button size="medium" @click="getCheckAssembly({id: curCheckedAssemblyId });">取 消</el-button>
          <el-button type="primary" size="medium" @click="saveSetting">保 存</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="字段数据规范设置" :visible.sync="dialogVisible" width="30%" v-el-drag-dialog>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        label-position="top"
        class="demo-ruleForm"
      >
        <el-form-item label="字段名" prop="filedName">
          <el-input v-model="ruleForm.filedName" disabled size="small"></el-input>
        </el-form-item>
        <el-form-item label="数据规范类型" prop="specificationType">
          <el-select v-model="ruleForm.specificationType" placeholder="请选择规范类型" style="width:100%" size="small">
            <el-option label="自定义编号" value="NUMBER"></el-option>
            <!-- <el-option label="公式" value="FORMULA"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="value">
          <el-select v-model="ruleForm.value" placeholder="请选择编号" style="width:100%" size="small">
            <el-option :label="item.name" :value="item.id" v-for="item of valueList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">重 置</el-button>
        <el-button type="primary" @click="settinBtn('ruleForm')" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import treeList from "@/components/common/TreeList/Index.vue";
export default {
  name: 'dataNorm',
  data() {
    return {
      dialogVisible: false,
      customTreeData: [], //左侧树形数据
      valueList: [], //所有的公式或者编号
      curCheckedAssemblyId: "", //当前的组件id
      curCheckeId: "", //当前选择的字段id
      ruleForm: {
        filedName: "",
        specificationType: "NUMBER",
        value: ""
      },
      rules: {
        specificationType: [
          { required: true, message: "请选择规范类型", trigger: "change" }
        ],
        value: [{ required: true, message: "请选择编号", trigger: "change" }]
      },
      tableData: [],
    };
  },
  components: {
    treeList
  },
  computed: {
    specificationType() {
      return this.ruleForm.specificationType;
    }
  },
  watch: {
    specificationType(val) {
      this.getFormulaLists(val);
    },
    dialogVisible(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
        this.ruleForm = {
          filedName: "",
          specificationType: "NUMBER",
          value: ""
        };
      }
    }
  },
  activated(){
    this.getAssemblyData();
    this.getFormulaLists(this.ruleForm.specificationType);
  },
  methods: {
    //获取选择的id
    getCheckAssembly({id }) {
      this.curCheckedAssemblyId = id;
      this.$http.templateService
        .getAssemblyAllFileds(this.$route.params.tempId, id)
        .then(res => {
          this.tableData = res.data;
        });
    },
    // 获取组件树
    getAssemblyData() {
      this.$http.templateService
        .getAssemblyData(this.$route.params.tempId)
        .then(res => {
          this.customTreeData = res.data;
          if(res.data && res.data.length){
            this.curCheckedAssemblyId = this.customTreeData[0].identifier;
            this.getCheckAssembly({id: this.curCheckedAssemblyId })
          }else{
            this.curCheckedAssemblyId = ''
          }
        });
    },
    openSettingDialog(id, name) {
      this.curCheckeId = id;
      this.ruleForm.filedName = name;
      this.getFormulaLists(this.ruleForm.specificationType);
      this.dialogVisible = true;
    },
    //修改设置
    editSetting(row) {
      this.curCheckeId = row.identifier;
      this.ruleForm.filedName = row.componentAttr.tag;
      this.ruleForm.specificationType = row.componentAttr.specification.specificationType;
      this.ruleForm.value = row.componentAttr.specification.value;
      // 添加当前id对应的数据到列表，避免出现页面id无法找到名称的问题
      this.valueList.some(item => item.id === this.ruleForm.value) || this.valueList.push({id:this.ruleForm.value , name:row.componentAttr.specification.name});
      this.dialogVisible = true;
    },
    //确定设置
    settinBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = this.valueList.find(item => item.id === this.ruleForm.value) || {}     //当前选择的编号对象
          this.tableData = this.tableData.map(item => {
            if (item.identifier === this.curCheckeId) {
              item.componentAttr.specification.value = this.ruleForm.value;
              item.componentAttr.specification.name = obj.name ;
              item.componentAttr.specification.specificationType = this.ruleForm.specificationType;
            }
            return item;
          });
          this.dialogVisible = false;
        }
      });
    },
    //保存设置
    saveSetting() {
      this.$http.templateService
        .saveDataSetting(this.$route.params.tempId, this.curCheckedAssemblyId, {
          listData: this.tableData
        })
        .then(res => {
          this.getCheckAssembly({id : this.curCheckedAssemblyId })
          this.$message({
            message: "数据规范保存成功",
            type: "success"
          });
        });
    },
    //获取所有的编号或者公式
    getFormulaLists(type) {
      this.$http.templateService.getFormulaLists(type,{enableOrDisable : 'ENABLE'}).then(res => {
        this.valueList = res.data;
      });
    },
    //判断数据类型
    getDataType(type) {
      switch (type) {
        case "NONE":
          return "不限";
        case "NUMBERS":
          return "数字";
        case "CHINESE":
          return "中文";
        case "CHARACTERS":
          return "字母";
        case "PHONE_NUMBER":
          return "电话号码";
        case "EMAIL":
          return "邮箱";
      }
    }
  }
};
</script>
<style scoped>
.tools-bar_common{
  padding: 5px 15px ;
}
.container-right .table-title::before{
  top: 12px;
}
.container-left {
  width: 250px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}
.container-right {
  padding-left: 263px;
  height: 100%;
}
.footer-box {
  margin:15px auto;
  text-align: center;
}
.icon-shezhi,
.icon-zidingyibianhao {
  cursor: pointer;
  font-size: 12px;
}
</style>
