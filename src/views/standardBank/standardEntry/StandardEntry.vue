<template>
  <div class="regulation-tb box-style_common" style="height:100%">
    <div class="tools-bar_common">
        <h5 class="table-title">{{curTitle}}
          <span class="top-tip" v-if='$route.params.type !=="entry"'>(提示：红色文字部分表示需修改项)</span>
        </h5>
      </div>
    <div class="standardEntry-box">
      <el-form :model="ruleForm" :rules="rules" :inline-message="false" ref="ruleForm" label-width="100px" class="demo-ruleForm" size='medium'>
        <el-row>
          <el-col  style="margin-right:65px" >
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.nameTag" :disabled="!isShowPositl(tag.nameTag)">
              <div slot="reference">
                <el-form-item label="标准名称" prop="standardName" :class="{'redColor':tag.nameTag}">
                  <el-input v-model="ruleForm.standardName" placeholder="请输入标准名称" :clearable="isEditOk" :readonly="!isEditOk"></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <el-row>
          <el-col  style="margin-right:65px" >
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.identifyCodeTag " :disabled="!isShowPositl(tag.identifyCodeTag )">
              <div slot="reference">
                <el-form-item label="标准号" prop="standardNo" :class="{'redColor':tag.identifyCodeTag}">
                  <el-input v-model="ruleForm.standardNo" placeholder="请输入标准号" :clearable="isEditOk" :readonly="!isEditOk"></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <el-row v-for='(item,index) of ruleForm.releaseMechanism' :key="index">
          <el-col :span="21">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.releaseMechanismTag " :disabled="!isShowPositl(tag.releaseMechanismTag)">
              <div slot="reference">
                <el-form-item label="发布机构" :prop="'releaseMechanism.' + index + '.content'" :rules="{ required: true, message: '发布机构不能为空', trigger: 'blur' }" :class="{'redColor':tag.releaseMechanismTag}">
                  <el-input v-model="item.content" placeholder="请输入发布机构" :clearable="isEditOk" :readonly="!isEditOk"></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <div>
            <el-button type="primary" style="margin-left:5px;padding:11px 15px" icon='iconfont icon-xinzeng' :disabled='$route.params.type ==="see"' size='small' @click="addReleaseMechanism(index)"
              v-if="index==0"></el-button>
            <el-button type="primary" style="margin-left:5px;padding:11px 15px;font-weight: bold;" :disabled='$route.params.type ==="see"' icon='iconfont icon-jian' size='small' @click="removeReleaseMechanism(index)"
              v-else></el-button>
          </div>
        </el-row>
        <el-row>
          <el-col style="min-width:250px">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.releaseTimeTag" :disabled="!isShowPositl(tag.releaseTimeTag)">
              <div slot="reference">
                <el-form-item label="发布时间" :class="{'redColor':tag.releaseTimeTag}">
                  <el-date-picker type="date" placeholder="请选择" value-format="timestamp" v-model="ruleForm.releaseTime" style="width:100%;"
                    :clearable="isEditOk" :readonly="!isEditOk"></el-date-picker>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <el-row>
          <el-col  style="min-width:250px">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.effectTimeTag" :disabled="!isShowPositl(tag.effectTimeTag)">
              <div slot="reference">
                <el-form-item label="实施时间" :class="{'redColor':tag.effectTimeTag}">
                  <el-date-picker type="date" placeholder="请选择" value-format="timestamp" v-model="ruleForm.implementTime" style="width:100%;"
                    @change="implementTimeChange" :clearable="isEditOk" :readonly="!isEditOk"></el-date-picker>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <el-row>
          <el-col  style="margin-right:65px" class="list-col">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.alternativeStandardNoTag" :disabled="!isShowPositl(tag.alternativeStandardNoTag)">
              <div slot="reference">
                <el-form-item label="代替标准号" :class="{'redColor':tag.alternativeStandardNoTag}">
                  <el-input v-model="ruleForm.alternativeStandardNo" placeholder="请输入标准号" :clearable="isEditOk" :readonly="!isEditOk"></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <el-row>
          <el-col >
            <el-popover placement="top-start" title="批改内容"  width="200" trigger="hover" :content="tag.standardStateTag" :disabled="!isShowPositl(tag.standardStateTag)">
              <div slot="reference">
                <el-form-item label="状态" :class="{'redColor':tag.standardStateTag}" prop='standardState'>
                  <el-radio-group v-model="ruleForm.standardState" :disabled="!isEditOk">
                    <el-radio label="UPCOMING_IMPLEMENT">即将实施</el-radio>
                    <el-radio label="CURRENT">现行</el-radio>
                    <el-radio label="INVALID">作废</el-radio>
                    <el-radio label="ABOLISH">废止</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <el-form-item label="上传原件" :class="{'redColor':uploadIsShow}" v-if="isEditOk" required>
          <el-col >
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
              <el-button style="margin-left: 25px;font-size: 12px;" @click="checkWordsPositl" slot="reference" size="small" v-show='uploadIsShow'>查看词条批注</el-button>
              <el-dialog title="词条批示" :visible.sync="dialogTableVisible">
                <el-table :data="gridData">
                  <el-table-column property="context" label="词条" width="550">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="scope.row.context" placement="bottom-start">
                        <span class="content-title">{{scope.row.context}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column property="contentTag" label="批示" width="">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="scope.row.contentTag" placement="bottom-start">
                        <span class="content-title">{{scope.row.contentTag}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <span v-show="isShowFileError" style="margin-left: 25px;color:#f56c6c;font-size: 12px;">请上传原件</span>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item style="transition: all .3s" v-if="isEditOk">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading='submitLoading'>提 交</el-button>
          <el-button @click="resetForm('ruleForm')">重 置</el-button>
        </el-form-item>
      </el-form>
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
        standardName: '', //标准名称
        standardNo: '', //标准号
        releaseMechanism: [{ content: '' }], //发布机构
        releaseTime: '', //发布时间
        implementTime: '', //实施时间
        alternativeStandardNo: '', //代替标准号
        originalAddress: '', //原件
        standardState: 'UPCOMING_IMPLEMENT' //状态
      },
      submitLoading:false,
      curTitle:'',//当前页面的title  
      tag: '', //保存接口返回数据，用于展示批注内容
      rules: {
        standardName: [{ required: true, message: '请输入标准名称', trigger: 'blur' }],
        releaseMechanism: [{ required: true, message: '请输入发布机构', trigger: 'blur' }],
        standardNo: [{ required: true, message: '请输入标准号', trigger: 'blur' }],
        standardState: [{ required: true, message: '请填写状态', trigger: 'blur' }]
      },
      gridData: [], //有批注的词条
      dialogTableVisible: false, //词条批注弹出框开关
      isEditOk: true, //是否可以编辑
      fileList: [], //文件上传列表
      uploadIsShow: false, //是否要重新上传文件
      isShowFileError: false, //是否显示上传文件的提示信息
      isShowUploadsBtn: false //是否显示上传按钮
    };
  },
  activated() {
    let title;
    //修改
    if (this.$route.params.type === 'edit') {
      title = '修改标准';
      this.judgeiSEditWords().then(() => {
        this.getDataMesg();
      });
      this.isEditOk = true; //可编辑
    } else if (this.$route.params.type === 'entry') {
      this.isEditOk = true; //可编辑
      title = '录入标准';
    } else {
      this.getDataMesg();
      this.isEditOk = false; //不可编辑，只能查看
      title = '查看标准';
    }
    this.curTitle = title
    this.$store.commit({
      type: 'tag_editTagsTitle',
      path: this.$route.path,
      title
    });
  },
  beforeRouteLeave(to, from, next){
    this.resetForm('ruleForm')
    next();
  },
  methods: {
    // 表单验证提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.originalAddress) {
            let params = {};
            for (let i in this.ruleForm) {
              params[i] = this.ruleForm[i];
            }
            this.submitLoading = true;
            params.releaseMechanism = this.reverseReleaseMechanism(this.ruleForm.releaseMechanism);
            if (this.$route.params.type === 'entry') {
              this.$http.standardService.standardLoad(params).then((data) => {
                this.backIndexPage();
              }).finally(()=>{
                this.submitLoading = false
              });
            } else if (this.$route.params.type === 'edit') {
              this.editStandard(params);
            }
          } else {
            this.isShowFileError = true; // 显示上传文件提示信息
            return false;
          }
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.ruleForm = {
        standardName: '', // 标准名称
        standardNo: '', // 标准号
        releaseMechanism: [{ content: '' }], // 发布机构
        releaseTime: '', // 发布时间
        implementTime: '', // 实施时间
        alternativeStandardNo: '', //代替标准号
        originalAddress: '', //原件
        standardState: 'UPCOMING_IMPLEMENT' //状态
      };
      this.$refs[formName].resetFields();
      this.fileList = [];
      this.isShowFileError = false;
      this.isShowCity = false;
      this.uploadIsShow = false;
    },
    //判断是否显示批注
    isShowPositl(tag) {
      return tag && this.$route.type !== 'entey';
    },
    //查看词条批注按钮
    checkWordsPositl() {
      this.dialogTableVisible = true;
    },
    // 增加发布机构输入框
    addReleaseMechanism() {
      //排除查看
      this.isEditOk && this.ruleForm.releaseMechanism.push({ conetent: '' });
    },
    //返回列表首页
    backIndexPage() {
      //清除对应tags
      this.$store.commit({
        type: 'tag_deleteTags',
        path: this.$route.path
      });
      this.$router.push({
        path: '/standardBank/standardList',
        query: {
          isRefresh: true // 刷新列表页
        }
      });
    },
    // 删除发布机构输入框
    removeReleaseMechanism(index) {
      this.isEditOk &&
        this.$nextTick(() => {
          // 或者第一个不能删除
          if (index) {
            this.ruleForm.releaseMechanism = this.ruleForm.releaseMechanism.filter((item, i) => {
              return i != index;
            });
          }
        });
    },
    // 将多个发布机构转化为以逗号分隔的字符串
    reverseReleaseMechanism(arr) {
      return arr
        .filter((item) => item.content)
        .map((item) => item.content)
        .join(',');
    },
    // 实施时间改变
    implementTimeChange() {
      this.ruleForm.standardState = new Date().getTime() - this.ruleForm.implementTime >= 0 ? 'CURRENT' : 'UPCOMING_IMPLEMENT';
    },
    // 显示上传按钮
    handleShowBtn() {
      this.isShowUploadsBtn = true;
    },
    //检查所传文件的格式
    beforeUpload(file) {
      if (!/\.docx$/.test(file.name)) {
        this.$message.warning('请选择docx格式的文档!');
        return false;
      }
      this.fileUpload(file);
      return false;
    },
    handleExceed() {
      this.$message.warning('只能选择一个文件，请删除后再选择!');
    },
    //上传文件
    fileUpload(file) {
      let _this = this;
      var reader = new FileReader();
      reader.readAsDataURL(file); //发起异步请求
      reader.onload = function() {
        let fileList = this.result.slice(this.result.indexOf(',') + 1);
        _this.$http.statute
          .uploadFile({ content: fileList })
          .then((data) => {
            _this.fileList = [{ name: file.name, url: data }];
            _this.ruleForm.originalAddress = data;
            _this.isShowFileError = false;
          })
      };
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    //判断是否重新上传原件
    judgeiSEditWords() {
      return this.$http.standardService.getWordsPosilt(this.$route.params.id).then((res) => {
        this.uploadIsShow = res.data.length > 0;
        this.gridData = res.data;
      });
    },
    //获取标准信息
    getDataMesg() {
      this.$http.standardService.getDataById(this.$route.params.id).then((res) => {
        this.tag = res.data.tag || {};
        this.ruleForm.standardName = res.data.name; //标准名称
        this.ruleForm.standardNo = res.data.identifyCode; //标准号
        this.ruleForm.releaseMechanism = res.data.releaseMechanism.split(',').map((item) => {
          return { content: item };
        }); //发布机构
        this.ruleForm.releaseTime = res.data.releaseTime; //发布时间
        this.ruleForm.implementTime = res.data.effectTime; //实施时间
        this.ruleForm.alternativeStandardNo = res.data.alternativeStandardNo; //代替标准号
        this.ruleForm.standardState = res.data.standardState; //状态
        if (this.uploadIsShow) {
          this.fileList = [];
          this.ruleForm.originalAddress = ''; //清空以前的原件地址
        } else {
          this.ruleForm.originalAddress = res.data.originalAddress; //原件
          this.fileList = [{ name: res.data.originalAddress, url: res.data.originalAddress }];
        }
      });
    },
    //修改标准
    editStandard(params) {
      this.$http.standardService
        .editStandard(this.$route.params.id, params)
        .then((res) => {
          this.backIndexPage();
          this.$message({
            showClose: true,
            message: '修改成功!',
            type: 'success',
            duration: 2000
          });
        }).finally(()=>{
          this.submitLoading = false
        });
    }
  }
};
</script>
<style lang="scss" scoped type="text/css">
.standardEntry-box {
  width: 450px;
  margin: auto;
}
</style>