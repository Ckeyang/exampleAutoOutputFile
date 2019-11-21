<template>
  <div class="regulation-tb box-style_common" style="height:100%">
    <div class="tools-bar_common">
      <h5 class="table-title">录入通知</h5>
    </div>
    <div style="margin:20px auto; width:500px;">
      <el-form :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="100px" class="demo-ruleForm notice-from"
        style="width:500px">
            <el-form-item label="通知名称" prop="noticeName">
              <el-input v-model="ruleForm.noticeName" placeholder="请输入关键字" clearable size='small'></el-input>
            </el-form-item>
            <el-form-item label="发布机构" prop="releaseMechanism">
              <el-input v-model="ruleForm.releaseMechanism" placeholder="请输入发布机构" clearable size='small'></el-input>
            </el-form-item>
            <el-form-item label="文体" prop="style">
              <el-input v-model="ruleForm.style" placeholder="请输入文体" clearable size='small'></el-input>
            </el-form-item>
            <el-form-item label="发布号" prop="postNo">
              <el-input v-model="ruleForm.postNo" placeholder="请输入发布号" clearable size='small'></el-input>
            </el-form-item>
            <el-form-item label="发布日期">
              <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.releaseTime" size='small' value-format="timestamp" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="关联法规" required style="position:relative">
              <el-button type="primary" size="small" @click="addRules">关联法规</el-button>
              <ul class="chech-box">
                <li v-for="(item,index) of checkedRegula" :key="index" class="regulation-list">
                  {{item.name}}
                  <i class="el-icon-close" @click="deleRegula" :data-index="item.id"></i>
                </li>
              </ul>
              <el-collapse-transition>
                <span class="regulationError" v-show="isShowregulationError">请关联法规</span>
              </el-collapse-transition>
            </el-form-item>
        <el-form-item label="上传原件" required>
            <el-upload class="upload-demo upload-custom" style="line-height:25px" ref="upload" action="http://127.0.0.1:3000/pay_animals/upFile"
              :before-upload="beforeUpload" :limit="1" :on-exceed="handleExceed" :file-list="fileList" :auto-upload="false" accept=".doc/docx">
              <div style="float: left;">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </div>
              <div slot="tip" class="el-upload__tip">只能上传word格式文件，且不超过500kb</div>
            </el-upload>
            <div style="margin-left: 10px;position: absolute; top:0;left: 100px ;line-height: 25px">
              <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <el-collapse-transition>
                <span v-show="isShowFileError" style="margin-left: 25px;color:#f56c6c;font-size: 12px;">请上传原件</span>
              </el-collapse-transition>
            </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size='medium'>提交</el-button>
          <el-button @click="resetForm('ruleForm')" size='medium'>重置</el-button>
        </el-form-item>
      </el-form>
      <div class="dialog-box">
        <el-dialog title="关联法规" :visible.sync="dialogVisible" width="30%">
          <div class="standard-search-box">
            <el-input v-model="statuteNameFrom" placeholder="请输入法规名称" clearable style="margin-right:15px;"></el-input>
            <el-button type="primary" @click="handleSearch" size="small">搜 索</el-button>
          </div>
          <div class="tb-box">
            <div style="margin: 20px 0 0;text-align:center;color:#909399" v-show='!regulaData.length'>暂无法规！</div>
            <el-checkbox-group v-model="checkedRegula" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in regulaData" :label="item" :key="item.name">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="checkAll-btn" v-show='regulaData.length'>全选</el-checkbox>
          </div>
          <span slot="footer" class="dialog-footer" v-show='regulaData.length'>
            <el-button @click="handleClose" size='medium'>取 消</el-button>
            <el-button type="primary" @click="handleDetermine" size='medium'>确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  data() {
    return {
      ruleForm: {
        noticeName: '', //通知名称
        releaseMechanism: '', //发布机构
        style: '', //文体
        postNo: '', //发布号
        releaseTime: '', //发布时间
        originalAddress: '', //地址
        statuteIds: [] //关联的法规
      },
      checkAll: false,
      checkedRegula: [], //选中的法规
      checkedTemp: [], //上一次选中的法规
      regulaData: [], //获取的法规列表
      isIndeterminate: false,
      statuteNameFrom: '', //搜索法规的名字
      rules: {
        noticeName: [
          { required: true, message: '请输入通知名称', trigger: 'blur' }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        releaseMechanism: [{ required: true, message: '请输入发布机构', trigger: 'blur' }],
        style: [{ required: true, message: '请输入文体类型', trigger: 'blur' }],
        postNo: [{ required: true, message: '请输入发布号', trigger: 'blur' }]
      },
      dialogVisible: false,
      fileList: [], //文件上传列表
      isShowFileError: false, //是否显示上传文件的提示信息
      isShowUploadsBtn: false, //是否显示上传按钮
      isShowregulationError: false //关联法规提示信息
    };
  },

  methods: {
    //表单验证提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validateCustom(); //自定义验证
          //提交表单数据
          if (this.checkedRegula.length && this.ruleForm.originalAddress) {
            this.ruleForm.statuteIds = this.checkedRegula.map((item) => {
              return item.id;
            });
            this.$http.statute
              .noticeLoad(this.ruleForm)
              .then((res) => {
                this.$router.push(`/statuteBank/addExplain/${res.data}/${this.ruleForm.noticeName}/${this.ruleForm.releaseTime}`);
                this.resetForm(formName);
              })
              .catch((err) => {
                this.$message({
                  message: '录入失败！请稍候再试',
                  type: 'error'
                });
              });
          }
        }
      });
    },
    //表单自定义验证
    validateCustom() {
      if (!this.checkedRegula.length) {
        this.isShowregulationError = true; //显示关联法规提示信息
      }
      if (!this.ruleForm.originalAddress) {
        this.isShowFileError = true; //显示上传文件提示信息
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isShowFileError = false;
      this.isShowregulationError = false;
      this.checkedTemp = [];
      this.checkedRegula = [];
      this.checkAll = false;
      this.fileList = [];
      this.ruleForm.releaseTime = '';
    },
    //检查所传文件的格式
    beforeUpload(file) {
      if (!/\.docx$/.test(file.name)) {
        this.$message.warning('请选择docx格式的文档');
        return false;
      }
      this.fileUpload(file);
      return false;
    },
    handleExceed() {
      this.$message.warning('只能选择一个文件，请删除后再选择');
    },
    //上传文件函数
    fileUpload(file) {
      let _this = this;
      var reader = new FileReader();
      reader.readAsDataURL(file); //发起异步请求
      reader.onload = function() {
        let fileList = this.result.slice(this.result.indexOf(',') + 1);
        _this.$http.statute.uploadFile({ content: fileList }).then((data) => {
          _this.fileList = [{ name: file.name, url: data }];
          _this.ruleForm.originalAddress = data;
          _this.isShowFileError = false;
        });
      };
    },

    //上传文件
    submitUpload(e) {
      this.$refs.upload.submit();
    },
    //全选
    handleCheckAllChange(val) {
      this.checkedRegula = val ? this.regulaData : [];
      this.isIndeterminate = false;
    },
    // 选择法规
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.regulaData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.regulaData.length;
    },
    //关联法规，打开对话框
    addRules() {
      this.handleSearch();
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
      this.checkedRegula = this.checkedTemp;
    },
    // 确定选择
    handleDetermine() {
      this.dialogVisible = false;
      this.checkedTemp = this.checkedRegula;
      if (this.checkedRegula.length) {
        this.isShowregulationError = false;
      }
    },
    //删除关联的法规
    deleRegula(e) {
      let index = e.target.getAttribute('data-index');
      this.checkedRegula = this.checkedRegula.filter((item) => {
        return item.id != index;
      });
      this.checkedTemp = this.checkedRegula;
    },
    // 去重
    removalFilter(data, data2) {
      let dataTemp = [];
      let flag = true;
      for (let item1 of data) {
        for (let item2 of data2) {
          if (item1.id == item2.id) {
            flag = false;
            break;
          }
        }
        if (flag) {
          dataTemp.push(item1);
        }
        flag = true;
      }
      return dataTemp;
    },
    // 法规搜索
    handleSearch() {
      this.$http.statute.getReglation('statuteName=' + this.statuteNameFrom).then((data) => {
        this.regulaData = this.removalFilter(data, this.checkedRegula);
      });
    }
  }
};
</script>
<style lang="scss" scoped type="text/css">
.standard-search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.regulation-list {
  position: relative;
  color: #606266;
  font-size: 14px;
  line-height: 30px;
  padding: 0 10px 0 20px;
  border-radius: 3px;
}

.regulation-list:hover {
  color: #26beff;
  background: #e0edf1;
}
.regulation-list i {
  cursor: pointer;
  position: absolute;
  right: 4px;
  top: 8px;
  display: none;
}
.regulation-list:hover i{
  display: inline-block;
}
.steps {
  width: 600px;
  position: relative;
  left: 50%;
  margin-left: -198px;
  margin-bottom: 30px;
}

.tb-box {
  max-height: 300px;
  overflow-y: auto;
}

.checkAll-btn {
  position: absolute;
  bottom: 30px;
}

.el-checkbox {
  transition: all 0.3s;
}

.el-checkbox:hover {
  background: #f9f9f9;
}

</style>