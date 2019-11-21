<template>
  <div class="regulation-tb box-style_common" style="height:100%">
     <div class="tools-bar_common">
        <h5 class="table-title">录入法规</h5>
      </div>
    <div class="entry-box">
      <el-form :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="100px" class="demo-ruleForm">
            <el-form-item label="法规名称" prop="statuteName">
              <el-input v-model="ruleForm.statuteName" placeholder="请输入关键字" clearable size='small'></el-input>
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
            <el-form-item label="发布时间" prop="releaseTime">
              <el-date-picker type="year" placeholder="请选择" format="yyyy 年" value-format="timestamp" v-model="ruleForm.releaseTime" size='small' style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="生效时间">
              <el-date-picker type="date" placeholder="请选择" value-format="timestamp" v-model="ruleForm.effectTime" size='small' style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="失效时间">
              <el-date-picker type="date" placeholder="请选择" value-format="timestamp" v-model="ruleForm.abolitionTime" size='small' style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="行政范围" class="citys">
              <cityes  rootId="ZONE" type="city" v-model="ruleForm.rangeApplication" size='small'></cityes>
            </el-form-item>
            <el-form-item label="行业分类">
              <cityes rootId="INDUSTRY" type="kind" v-model="ruleForm.industryClassification" size='small'></cityes>
            </el-form-item>
            <el-form-item label="法规摘要" >
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="ruleForm.statuteDescription" size='small'>
              </el-input>
            </el-form-item>
        <el-form-item label="上传原件" required>
            <el-upload class="upload-demo upload-custom" style="line-height: 25px" ref="upload" action="/files"
              :file-list="fileList" :before-upload="beforeUpload" :limit="1" :on-exceed="handleExceed" :auto-upload="false"
              :on-change="handleShowBtn" :show-file-list="true">
              <div style="float: left;">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </div>
              <div slot="tip" class="el-upload__tip">只能上传word格式文件，且不超过500kb</div>
            </el-upload>
            <div style="margin-left: 10px;position: absolute; top:0;left: 100px ;line-height: 25px">
              <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload" v-show="isShowUploadsBtn">上传到服务器</el-button>
              <span v-show="isShowFileError" style="margin-left: 25px;color:#f56c6c;font-size: 12px;">请上传原件</span>
            </div>
        </el-form-item>
        <el-form-item style="transition: all .3s">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="isUpLoading">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import cityes from '@/components/tools/Cityes.vue';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  data() {
    return {
      ruleForm: {
        statuteName: '', //法规名称
        releaseMechanism: '', //发布机构
        style: '', //文体
        postNo: '', //发布号
        releaseTime: '', //发布时间
        effectTime: '', //生效时间
        abolitionTime: '', //失效时间
        rangeApplication: '国家', //发布范围
        industryClassification: '', //分类
        statuteDescription: '',
        reviewStatus: '0', //审核状态  默认为0 待审核
        originalAddress: '' //原件
      },
      rules: {
        statuteName: [
          { required: true, message: '请输入法规名称', trigger: 'blur' }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        releaseMechanism: [{ required: true, message: '请输入发布机构', trigger: 'blur' }],
        style: [{ required: true, message: '请输入文体', trigger: 'blur' }],
        postNo: [{ required: true, message: '请输入发布号', trigger: 'blur' }]
      },
      fileList: [], //文件上传列表
      isShowFileError: false, //是否显示上传文件的提示信息
      isShowUploadsBtn: false, //是否显示上传按钮
      isUpLoading:false, //是否正在保存
    };
  },
  components: {
    cityes //工具函数组件
  },
  methods: {
    //表单验证提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.originalAddress) {
            this.isUpLoading = true
            this.$http.statute.reglationLoad(this.ruleForm).then((data) => {
              this.resetForm(formName);
              //清除对应tags
              this.$store.commit({
                type: 'tag_deleteTags',
                path: this.$route.path
              });
              this.$router.push({
                path: '/statuteBank/regulationlist',
                query: {
                  isRefresh: true // 刷新列表页
                }
              });
            }).finally(()=>{
              this.isUpLoading = false
            });
          } else {
            this.isShowFileError = true; //显示上传文件提示信息
            return false;
          }
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.ruleForm = {
        statuteName: '', //法规名称
        releaseMechanism: '', //发布机构
        style: '', //文体
        postNo: '', //发布号
        releaseTime: '', //发布时间
        effectTime: '', //生效时间
        abolitionTime: '', //失效时间
        rangeApplication: '国家', //发布范围
        industryClassification: '', //分类
        statuteDescription: '',
        reviewStatus: '0',
        originalAddress: '' //原件
      };
      this.$refs[formName].resetFields();
      this.fileList = [];
      this.isShowFileError = false;
      this.isShowCity = false;
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
    handleShowBtn() {
      this.isShowUploadsBtn = true;
    },
    //上传文件
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
    submitUpload() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style scoped>
.entry-box {
  width: 500px;
  margin: auto;
}
.entry-box >>> .el-form-item{
  margin-bottom: 16px;
}
</style>