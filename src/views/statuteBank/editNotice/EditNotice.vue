<template>
  <div class="regulation-tb box-style_common" style="height:100%">
    <div class="tools-bar_common">
      <h5 class="table-title">编辑通知<span class='top-tip'>提示：*红色名称部分表示需修改项</span></h5>
    </div>
    <el-form :model="ruleForm" :rules="rules" :inline-message="false" ref="ruleForm" label-width="100px" class="demo-ruleForm notice-from"
      style=" width:500px;margin:auto">
      <el-row>
        <el-col>
          <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.nameTag" :disabled="isDisabledPopover(tag.nameTag)">
            <div slot="reference">
              <el-form-item label="通知名称" prop="noticeName" :class="{'redColor':tag.nameTag}">
                <el-input v-model="ruleForm.noticeName " placeholder="请输入通知名称" :readonly="!isEditOk" :clearable="isEditOk" size="small"></el-input>
              </el-form-item>
            </div>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.releaseMechanismTag" :disabled="isDisabledPopover(tag.releaseMechanismTag)">
            <div slot="reference">
              <el-form-item label="发布机构" prop="releaseMechanism" :class="{'redColor':tag.releaseMechanismTag}">
                <el-input v-model="ruleForm.releaseMechanism" placeholder="请输入发布机构" :readonly="!isEditOk" :clearable="isEditOk" size="small"></el-input>
              </el-form-item>
            </div>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.styleTag" :disabled="isDisabledPopover(tag.styleTag)">
            <div slot="reference">
              <el-form-item label="文体" prop="style" :class="{'redColor':tag.styleTag}">
                <el-input v-model="ruleForm.style" placeholder="请输入文体" :readonly="!isEditOk" :clearable="isEditOk" size="small"></el-input>
              </el-form-item>
            </div>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.identifyCodeTag" :disabled="isDisabledPopover(tag.identifyCodeTag)">
            <div slot="reference">
              <el-form-item label="发布号" prop="postNo" :class="{'redColor':tag.identifyCodeTag}">
                <el-input v-model="ruleForm.postNo" placeholder="请输入发布号" :readonly="!isEditOk" :clearable="isEditOk" size="small"></el-input>
              </el-form-item>
            </div>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.releaseTimeTag" :disabled="isDisabledPopover(tag.releaseTimeTag)">
            <div slot="reference">
              <el-form-item label="发布日期" :class="{'redColor':tag.releaseTimeTag}">
                <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.releaseTime" size="small" value-format="timestamp" style="width: 100%;"
                  :readonly="!isEditOk"></el-date-picker>
              </el-form-item>
            </div>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="关联法规" required style="position:relative">
            <el-button type="primary" size="small" @click="addRules" v-if="isEditOk">关联法规</el-button>
            <transition name="el-fade-in-linear">
            <ul class="chech-box">
              <li v-for="(item,index) of checkedRegula" :key="index" class="regulation-list">{{index+1}}.&nbsp; {{item.name}}
                <i class="el-icon-close" @click="deleRegula" :data-index="item.id" v-if="isEditOk"></i>
              </li>
            </ul>
            </transition>
            <p v-if="checkedRegula.length===0" style="text-align:center;color:#606266">暂无关联法规!</p>
            <span class="regulationError" v-show="isShowregulationError">请关联法规</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      </el-row>
      <el-form-item label="修改原件" v-if="isEditOk">
        <el-col>
          <el-upload class="upload-demo upload-custom" style="line-height:25px" ref="upload" action="http://127.0.0.1:3000/pay_animals/upFile"
            :before-upload="beforeUpload" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList"
            :auto-upload="false" accept=".doc/docx">
            <div style="float: left;">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传word格式文件，且不超过500kb</div>
          </el-upload>
          <div style="margin-left: 10px;position: absolute; top:0;left: 100px ;line-height: 25px">
            <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <preview :url="ruleForm.originalAddress" style="margin-left: 65px;color:#0ae;font-size: 12px;" name="查看原件"></preview>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item label="通知内容" v-if="!isEditOk">
        <el-col>
          <ul class="chech-box notice-box">
            <li v-for="(item,index) of noticesContent" :key="index" class="regulation-list">
              <el-tooltip class="item" effect="light" v-if="item" :content="item" placement="bottom-start">
                <span>{{index+1}}.&nbsp;{{item}}</span>
              </el-tooltip>
            </li>
          </ul>
          <p v-if="noticesContent.length==0" style="text-align:center;color:#606266">暂无通知词条!</p>
        </el-col>
      </el-form-item>
      <el-form-item label="查看原件" v-if="!isEditOk">
        <el-col>
          <preview :url="ruleForm.originalAddress" name="点击查看" style="color:#26beff;margin-left:20px"></preview>
        </el-col>
      </el-form-item>
      <el-form-item v-if="isEditOk">
        <el-button type="primary" @click="submitForm('ruleForm')" size="medium">提交</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="dialog-box">
      <el-dialog title="关联法规" :visible.sync="dialogVisible" width="30%">
        <div class="standard-search-box">
            <el-input v-model="statuteNameFrom" placeholder="请输入法规名称"  :clearable="isEditOk" @keyup.enter.native='handleSearch' style="margin-right:15px;"></el-input>
            <el-button type="primary" @click="handleSearch" size="small">搜 索</el-button>
        </div>
        <div class="tb-box">
          <div style="margin: 20px 0 0;text-align:center;color:#909399" v-show='!regulaData.length'>暂无法规！</div>
          <el-checkbox-group v-model="checkedRegula" >
            <el-checkbox v-for="(item,index) in regulaData" :label="item" :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="checkAll-btn" v-show='regulaData.length'>全选</el-checkbox>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose" size="medium">取 消</el-button>
          <el-button type="primary" @click="handleDetermine" size="medium">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import preview from '@/components/tools/Preview.vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      ruleForm: {
        noticeName: '',
        originalAddress: '',
        style: '',
        postNo: '',
        releaseTime: '',
        releaseMechanism: '',
        statuteIds: []
      },
      isEditOk: true, //---------------是否可以编辑---------------------
      noticesContent: [], //-----------通知词条的内容-------------------
      tag: '', //-------------保存路由传递数据-------------------
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
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  components: {
    preview
  },
  activated() {
    this.getReglations();
    if (this.$route.params.id.indexOf('see') >= 0) {
      this.isEditOk = false; //不可编辑，只能查看
      this.getAllNoticesContent();
    } else {
      this.isEditOk = true; //可编辑
    }
    this.$store.commit({
      type: 'tag_editTagsTitle',
      path: this.$route.path,
      title: this.isEditOk ? '编辑通知' : '查看通知'
    });
  },
  methods: {
    //表单验证提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validateCustom(); //自定义验证
          if (this.checkedRegula.length && this.ruleForm.originalAddress) {
            this.ruleForm.statuteIds = this.checkedRegula.map((item) => {
              return item.id;
            });
            this.$http.statute.editNotices(this.ruleForm.id, this.ruleForm).then((res) => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              let obj = {
                noticeName: this.ruleForm.noticeName,
                noticeId: this.$route.params.id,
                effectTime: this.ruleForm.releaseTime
              };
              this.$router.push(`/statuteBank/addExplain/${JSON.stringify(obj)}`);
              this.resetForm(formName);
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
      this.isIndeterminate = false;
      this.checkAll = false;
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
    //是否禁用批示提示
    isDisabledPopover(val) {
      return !val || val == null;
    },
    //删除文件
    beforeRemove() {
      this.originalAddress = '';
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

    //关联法规，打开对话框
    addRules() {
      this.handleSearch();
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
      this.checkedRegula = this.checkedTemp;
      this.isIndeterminate = false;
      this.checkAll = false;
    },
    // 确定选择
    handleDetermine() {
      this.dialogVisible = false;
      this.checkedTemp = this.checkedRegula;
      if (this.checkedRegula.length) {
        this.isShowregulationError = false;
      }
    },
    //获取该通知下所有的通知词条
    getAllNoticesContent() {
      this.$http.statute.getAllNoticesContent(this.$route.params.id.replace('see', '')).then((res) => {
        this.noticesContent = res.data.map((item) => item.newContext);
      });
    },
    //删除关联的法规
    deleRegula(e) {
      let index = e.target.getAttribute('data-index');
      this.checkedRegula = this.checkedRegula.filter((item) => {
        return item.id != index;
      });
      this.checkedTemp = this.checkedRegula;
    },
    //获取通知内容及其关联的法规
    getReglations() {
      this.$http.statute.getReglationAddNotices(this.$route.params.id.replace('see', '')).then((res) => {
        this.ruleForm.noticeName = res.data.notice.name;
        this.ruleForm.releaseMechanism = res.data.notice.releaseMechanism;
        this.ruleForm.releaseTime = res.data.notice.releaseTime;
        this.ruleForm.postNo = res.data.notice.identifyCode;
        this.ruleForm.style = res.data.notice.style;
        this.ruleForm.originalAddress = res.data.notice.originalAddress;
        this.ruleForm.id = res.data.notice.id;
        this.checkedRegula = res.data.statute;
        this.checkedTemp = res.data.statute;
        this.fileList = [{ name: this.ruleForm.originalAddress, url: this.ruleForm.originalAddress }];
        this.tag = res.data.notice.tag || {};
      });
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
.regulationError {
  position: absolute;
  top: 0;
  left: 100px;
  color: #f56c6c;
  font-size: 12px;
}
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
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
  height: 300px;
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
  background: #e0edf1;
}

</style>