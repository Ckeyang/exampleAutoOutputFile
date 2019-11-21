<template>
  <div class="regulation-tb box-style_common" style="height:100%">
    <div class="tools-bar_common">
      <h5 class="table-title">编辑通知<span class='top-tip'>提示：*红色名称部分表示需修改项</span></h5>
    </div>
    <div class="entry-box">
      <el-form :model="ruleForm" :rules="rules" :inline-message="false" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-col  class="list-col">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.nameTag" :disabled="isDisabledPopover(tag.nameTag)">
              <div @click="openApproval" slot="reference">
                <el-form-item label="法规名称" prop="statuteName" :class="{'redColor':tag.nameTag}">
                  <el-input v-model="ruleForm.statuteName" placeholder="请输入关键字" :readonly="!isEditOk" :clearable="isEditOk" size='small'></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col>
            <el-popover placement="top-start" title="批注内容" width="200" trigger="hover" :content="tag.releaseMechanismTag" :disabled="isDisabledPopover(tag.releaseMechanismTag)">
              <div slot="reference">
                <el-form-item label="发布机构" prop="releaseMechanism" :class="{'redColor':tag.releaseMechanismTag}">
                  <el-input v-model="ruleForm.releaseMechanism" placeholder="请输入发布机构" :readonly="!isEditOk" :clearable="isEditOk" size='small'></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col  class="list-col" :class="{'redColor':tag.styleTag}">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.styleTag" :disabled="isDisabledPopover(tag.styleTag)">
              <div slot="reference">
                <el-form-item label="文体" prop="style" :class="{'redColor':tag.styleTag}">
                  <el-input v-model="ruleForm.style" placeholder="请输入发布机构" :readonly="!isEditOk" size='small' :clearable="isEditOk"></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col>
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.identifyCodeTag" :disabled="isDisabledPopover(tag.identifyCodeTag)">
              <div slot="reference">
                <el-form-item label="发布号" prop="postNo" :class="{'redColor':tag.identifyCodeTag}">
                  <el-input v-model="ruleForm.postNo" placeholder="请输入发布号" :readonly="!isEditOk" size='small' :clearable="isEditOk"></el-input>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col  :class="{'redColor':tag.releaseTimeTag}">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.releaseTimeTag" :disabled="isDisabledPopover(tag.releaseTimeTag)">
              <div slot="reference">
                <el-form-item label="发布时间" prop="releaseTime">
                  <el-date-picker type="year" placeholder="请选择" format="yyyy 年" size='small' value-format="timestamp" v-model="ruleForm.releaseTime" :readonly="!isEditOk"
                    :clearable="isEditOk" style="width:100%;"></el-date-picker>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col  :class="{'redColor':tag.effectTimeTag}">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.effectTimeTag" :disabled="isDisabledPopover(tag.effectTimeTag)">
              <div slot="reference">
                <el-form-item label="生效时间">
                  <el-date-picker type="date" placeholder="请选择" value-format="timestamp" size='small' v-model="ruleForm.effectTime" :readonly="!isEditOk"
                    :clearable="isEditOk" style="width:100%;"></el-date-picker>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col :class="{'redColor':tag.rangeApplicationTag}">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.rangeApplicationTag" :disabled="isDisabledPopover(tag.rangeApplicationTag)">
              <div slot="reference">
                <el-form-item label="行政范围">
                  <cityes  rootId="ZONE" type="city" v-model="ruleForm.rangeApplication" size='small' :isReadOnly="!isEditOk"></cityes>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col  :class="{'redColor':tag.industryClassificationTag}">
            <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="tag.industryClassificationTag"
              :disabled="isDisabledPopover(tag.industryClassificationTag)">
              <div slot="reference">
                <el-form-item label="行业分类">
                  <cityes  rootId="INDUSTRY" type="kind" v-model="ruleForm.industryClassification" 
                    size='small'
                    :isReadOnly="!isEditOk"></cityes>
                </el-form-item>
              </div>
            </el-popover>
          </el-col>
          <el-col>
            <el-form-item label="法规摘要">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="ruleForm.statuteDescription" size='small' :readonly="!isEditOk">
              </el-input>
            </el-form-item>
          </el-col>
        <el-form-item label="上传原件"  :class="{'redColor':uploadIsShow}" v-if="isEditOk">
          <el-col class="upload-custom">
            <el-upload class="upload-demo" style="line-height: 25px" ref="upload" action="/files"
              :file-list="fileList" :before-upload="beforeUpload" :limit="1" :on-exceed="handleExceed" :auto-upload="false"
              :on-change="handleShowBtn" :show-file-list="true">
              <div style="float: left;">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </div>
              <div slot="tip" class="el-upload__tip">只能上传word格式文件，且不超过500kb</div>
            </el-upload>
            <div style="margin-left: 10px;position: absolute; top:0;left: 100px ;line-height: 25px">
              <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload" v-show="isShowUploadsBtn">上传到服务器</el-button>
              <el-button style="margin-left: 25px;font-size: 12px;" @click="checkWords" slot="reference" size="small">查看词条批注</el-button>
              <el-dialog title="词条批示" :visible.sync="dialogTableVisible">
                <el-table :data="gridData" style="width:100%;" size='mini' border>
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
              <span v-show="isShowFileError" style="margin-left: 25px;color:#f56c6c;font-size: 12px;">请重新上传原件</span>
            </div>
          </el-col>
        </el-form-item>
          <el-col>
            <div v-if="isEditOk">
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" size='medium'>确认修改</el-button>
                <el-button @click="resetForm('ruleForm')" style="margin-left:34px" size='medium'>重置</el-button>
              </el-form-item>
            </div>
          </el-col>
      </el-form>
    </div>
    <div>
    </div>
  </div>
</template>
<script>
import cityes from '@/components/tools/Cityes.vue';
import { mapGetters } from 'vuex';
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
        rangeApplication: '', //发布范围
        industryClassification: '', //分类
        statuteDescription: '', //摘要
        reviewStatus: '',
        originalAddress: '' //原件
      },
      gridData: [], //存放有批示的词条
      dialogTableVisible: false,
      isEditOk: true, //---------------是否可以编辑---------------------

      uploadIsShow: false, //是否需要重新上传原件
      dialogVisible: false,
      tag: '', // 法规批注
      isClear: false,
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
      isShowUploadsBtn: false //是否显示上传按钮
    };
  },
  activated() {
    if (this.$route.params.id.indexOf('see') >= 0) {
      this.isEditOk = false; //不可编辑，只能查看
      this.getData();
    } else {
      this.isEditOk = true; //可编辑
      this.isShowFileError = false;
      this.judgeiSEditWords().then(() => {
        this.getData();
      });
    }
    this.$store.commit({
      type: 'tag_editTagsTitle',
      path: this.$route.path,
      title: this.isEditOk ? '编辑法规' : '查看法规'
    });
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
            this.$http.statute.reglationEdit(this.$route.params.id, this.ruleForm).then((data) => {
              //清除对应tags
              this.$store.commit({
                type: 'tag_deleteTags',
                path: this.$route.path
              });
              this.$router.push({
                path: '/statuteBank/regulationlist',
                query: { isRefresh: true }
              });
            });
          } else {
            this.isShowFileError = true; //显示上传文件提示信息
            return false;
          }
        }
      });
    },
    //判断是否重新上传原件
    judgeiSEditWords() {
      return this.$http.statute.getPositlWords({ statuteId: this.$route.params.id.replace('see', '') }).then((res) => {
        this.uploadIsShow = res.data.content.length > 0;
      });
    },
    //查看词条
    checkWords() {
      this.dialogTableVisible = true;
      this.getWordsData();
    },
    openApproval(e) {
      if (e.target.tagName == 'LABEL') {
        this.dialogVisible = true;
      }
    },
    //是否禁用批示提示
    isDisabledPopover(val) {
      return !val || val == null;
    },
    //选择城市
    getCityes(city) {
      this.ruleForm.rangeApplication = city;
    },
    //选择行业
    getKinds(city) {
      this.ruleForm.industryClassification = city;
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
        reviewStatus: '',
        originalAddress: '' //原件
      };
      this.$refs[formName].resetFields();
      this.isShowFileError = false;
      this.isShowCity = false;
      this.isClear = !this.isClear;
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
    //获取法规数据
    getData() {
      this.$http.statute.getDataById(this.$route.params.id.replace('see', '')).then((res) => {
        this.tag = res.data.tag || {};
        this.ruleForm.statuteName = res.data.name; //法规名称
        this.ruleForm.releaseMechanism = res.data.releaseMechanism; //发布机构
        this.ruleForm.style = res.data.style; //文体
        this.ruleForm.postNo = res.data.identifyCode; //发布号
        this.ruleForm.releaseTime = res.data.releaseTime; //发布时间
        this.ruleForm.effectTime = res.data.effectTime; //生效时间
        this.ruleForm.abolitionTime = res.data.abolitionTime; //失效时间
        this.ruleForm.rangeApplication = res.data.rangeApplication; //发布范围
        this.ruleForm.industryClassification = res.data.industryClassification; //分类
        this.ruleForm.statuteDescription = res.data.description; //摘要
        this.ruleForm.reviewStatus = res.data.auditState;
        if (this.uploadIsShow) {
          this.fileList = [];
          this.ruleForm.originalAddress = ''; //清空以前的原件地址
        } else {
          this.ruleForm.originalAddress = res.data.originalAddress; //原件
          this.fileList = [{ name: res.data.originalAddress, url: res.data.originalAddress }];
        }
      });
    },
    //获取有批示的词条
    getWordsData() {
      let params = {
        pageSize: 30,
        current: 0,
        statuteId: this.$route.params.id.replace('see', '')
      };
      this.$http.statute.getPositlWords(params).then((res) => {
        let neWData = res.data.content.filter((item) => {
          return item.contentTag;
        });
        this.gridData = neWData;
      });
    },
    //上传文件
    fileUpload(file) {
      let _this = this;
      var reader = new FileReader();
      reader.readAsDataURL(file); //发起异步请求
      reader.onload = function() {
        let fileList = this.result.slice(this.result.indexOf(',') + 1);
        _this.$http.statute.uploadFile({ content: fileList }).then((data) => {
          _this.fileList = [{ name: file.name, url: data.data }];
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
<style scoped > 
.entry-box {
  width: 500px;
  margin: auto;
}
.entry-box >>> .el-form-item{
  margin-bottom: 16px;
}

.redColor label {
  color: red;
}
.upload-custom{
  position: relative;
}
</style>