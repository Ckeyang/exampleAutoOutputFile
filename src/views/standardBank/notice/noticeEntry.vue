<template>
    <div class="regulation-tb box-style_common" style="height:100%">
      <div class="tools-bar_common">
        <h5 class="table-title">{{$route.params.id.length == 1 ? '录入公告':'查看公告'}}
          <span class="top-tip" v-if='$route.params.id.length > 1'>(提示：红色文字部分表示需修改项)</span>
        </h5>
      </div>
      <div class="noticeEntry">
            <el-form :model="noticeForm" :rules="rules" :inline-message="false" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="method==='noReview'">
                <el-row>
                    <el-col>
                      <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="noticeForm.tag.nameTag" :disabled="!isShowPositl(noticeForm.tag.nameTag)">
                         <div slot="reference">
                            <el-form-item label="公告名称" prop="name" :class="{'redColor':noticeForm.tag.nameTag}">
                               <el-input v-model="noticeForm.name" placeholder="请输入公告" size='small'></el-input>
                             </el-form-item>
                          </div>
                       </el-popover>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                      <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="noticeForm.tag.releaseMechanismTag" :disabled="!isShowPositl(noticeForm.tag.releaseMechanismTag)">
                         <div slot="reference">
                            <el-form-item label="发布机构" prop="releaseMechanism" :class="{'redColor':noticeForm.tag.releaseMechanismTag}">
                               <el-input v-model="noticeForm.releaseMechanism" placeholder="请输入发布机构" size='small'></el-input>
                             </el-form-item>
                          </div>
                       </el-popover>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col >
                      <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="noticeForm.tag.styleTag" :disabled="!isShowPositl(noticeForm.tag.styleTag)">
                         <div slot="reference">
                            <el-form-item label="文体" prop="style" :class="{'redColor':noticeForm.tag.styleTag}">
                               <el-input v-model="noticeForm.style" placeholder="请输入文体" size='small'></el-input>
                             </el-form-item>
                          </div>
                       </el-popover>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col >
                        <el-form-item label="发布号" prop="identifyCode" :class="{'redColor':noticeForm.tag.identifyCodeTag}">
                            <el-input v-model="noticeForm.identifyCode" placeholder="请输入发布号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col >
                      <div class="redColor annotation"><label>{{noticeForm.tag.identifyCodeTag}}</label></div>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col >
                       <el-popover placement="top-start" title="批改内容" width="200" trigger="hover" :content="noticeForm.tag.releaseTimeTag" :disabled="!isShowPositl(noticeForm.tag.releaseTimeTag)">
                         <div slot="reference">
                            <el-form-item label="发布时间" prop="releaseTime" :class="{'redColor':noticeForm.tag.releaseTimeTag}">
                               <el-date-picker type="date" placeholder="请选择" size='small'  v-model="noticeForm.releaseTime" style="width:100%;"></el-date-picker>
                             </el-form-item>
                          </div>
                       </el-popover>
                    </el-col>
                    <!-- <el-col >
                      <div class="redColor annotation"><label>{{noticeForm.tag.releaseTimeTag}}</label></div>
                    </el-col> -->
                </el-row>
                <el-form-item label="关联标准">
                    <el-col >
                        <el-button  size="small" type="primary" @click="showAddDialog" >添加标准</el-button>
                    </el-col>
                    <!-- <el-col >
                      <div class="redColor annotation"><label></label></div>
                    </el-col> -->
                </el-form-item>
                <el-form-item label="">
                    <el-col >
                        <p class="bzbox" v-for="(item,index) in noticeForm.standards" :key="index">{{item.name}} <span class="el-icon-close bzclose" @click="removeStandar" :itemid="item.id" :index="index"></span></p>
                    </el-col>
                </el-form-item>
                <el-form-item label="上传原件" prop="originalAddress">
                    <el-col >
                        <el-upload class="upload-demo upload-custom" style="line-height: 25px" ref="upload" action=""
                            :file-list="fileList" :before-upload="beforeUpload" :limit="1" :before-remove="beforeRemove" :on-exceed="handleExceed" :auto-upload="false" :show-file-list="true" accept=".doc/docx">
                            <div style="float: left;">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            </div>
                            <div slot="tip" class="el-upload__tip">只能上传word格式文件，且不超过500kb</div>
                        </el-upload>
                        <div style="margin-left: 10px;position: absolute; top:0;left: 100px ;line-height: 25px">
                            <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                            <span v-show="isShowFileError" style="margin-left: 25px;color:#f56c6c;font-size: 12px;">请上传原件</span>
                        </div>
                    </el-col>
                    <!-- <el-col >
                      <div class="redColor" style="height:40px;line-height:40px;"><label></label></div>
                    </el-col> -->
                </el-form-item>
                <el-form-item style="transition: all .3s">
                    <el-button type="primary" @click="goNext()" size='medium'>下一步</el-button>
                </el-form-item>
            </el-form>
              <el-form :model="noticeForm" :rules="rules" :inline-message="false" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="method==='review'">
                <el-row>
                    <el-col >
                        <el-form-item label="公告名称" prop="name">
                            {{noticeForm.name}}
                        </el-form-item>
                    </el-col>
                    <el-col >
                       <div  class="annotation">
                      <i class="iconfont icon-pishi" :class="noticeForm.tag.nameTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'"
                        data-value="nameTag" @click="editAnnotation">&nbsp;&nbsp;{{!noticeForm.tag.nameTag?"批注":"已批注"}}</i>
                       </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col >
                        <el-form-item label="发布机构" prop="releaseMechanism">
                            {{noticeForm.releaseMechanism}}
                        </el-form-item>
                    </el-col>
                    <el-col >
                       <div  class="annotation">
                      <i class="iconfont icon-pishi" :class="noticeForm.tag.releaseMechanismTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'"
                        data-value="releaseMechanismTag"  @click="editAnnotation">&nbsp;&nbsp;{{!noticeForm.tag.releaseMechanismTag?"批注":"已批注"}}</i>
                       </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col >
                        <el-form-item label="文体" prop="style">
                           {{noticeForm.style}}
                        </el-form-item>
                    </el-col>
                    <el-col >
                       <div  class="annotation">
                      <i class="iconfont icon-pishi" :class="noticeForm.tag.styleTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'"
                        data-value="styleTag"  @click="editAnnotation">&nbsp;&nbsp;{{!noticeForm.tag.styleTag?"批注":"已批注"}}</i>
                       </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col >
                        <el-form-item label="发布时间" prop="releaseTime">
                            {{formatDate(noticeForm.releaseTime)}}
                        </el-form-item>
                    </el-col>
                    <el-col >
                       <div  class="annotation">
                      <i class="iconfont icon-pishi" :class="noticeForm.tag.releaseTimeTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'"
                        data-value="releaseTimeTag"  @click="editAnnotation">&nbsp;&nbsp;{{!noticeForm.tag.releaseTimeTag?"批注":"已批注"}}</i>
                       </div>
                    </el-col>
                </el-row>
                <el-form-item style="transition: all .3s">
                    <el-button type="primary" @click="goNext()">下一步</el-button>
                </el-form-item>
            </el-form>
            <el-dialog title="批注" :visible.sync="isShowAnnotation" width="30%">
                    <el-row style="line-height:40px">
                    </el-row>
                    <div class="tb-box">
                    <div style="margin: 15px 0;"></div>
                    <el-input type="textarea" v-model="noticeForm.tag[curType]"  rows="6" resize="none"></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="isShowAnnotation=false">保 存</el-button>
                    </span>
            </el-dialog>
            <el-dialog title="关联标准" :visible.sync="dialogVisible" width="30%">
                    <div class="standard-search-box">
                      <el-input v-model="search.keyWords" placeholder="请输入关键字" clearable size='small' style="margin-right:15px;"></el-input>
                      <el-button type="primary" @click="handleSearch" size="small">搜索</el-button>
                    </div>
                    <div class="tb-box">
                    <div class="autoBox" style="margin: 15px 0;max-height:200px;overflow:auto;">
                    <el-checkbox-group v-model="checkedRegula">
                        <el-checkbox v-for="(item,index) in regulaData" :label="item.id" :key="index">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                    </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible=false" size='medium'>取 消</el-button>
                    <el-button type="primary" @click="addStandard" size='medium'>保 存</el-button>
                    </span>
            </el-dialog>
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
      curId: '',
      statuteNameFrom: '',
      checkedRegula: [],
      regulaData: [],
      dialogVisible: false,
      search: { keyWords: '', reviewStatus: '2' },
      isShowAnnotation: false,
      method: 'noReview',
      curType: '',
      tags: {
        identifier: '',
        identifyCodeTag: '',
        nameTag: '',
        releaseMechanismTag: '',
        releaseTimeTag: '',
        styleTag: ''
      },
      noticeForm: {
        name: '', //名称
        releaseMechanism: '', //发布机构
        style: '',
        identifyCode: '',
        standards: [],
        tag: {},
        literatureIds: [],
        releaseTime: '', //发布时间
        originalAddress: '' //原件
      },
      fileList: [],
      isShowUploadsBtn: false,
      isShowFileError: false,
      rules: {
        name: [{ required: true, message: '请输入通知名称', trigger: 'blur' }],
        originalAddress: [{ required: true, message: '请上传文件' }]
      }
    };
  },
  activated() {
    this.curId = this.$route.params.id;
    this.method = sessionStorage.getItem('noticeMethod');
    this.fileList = [];
    if (this.curId !== '0') {
      this.getNoticeItem();
    } else {
      this.createNewNoticeItem();
    }
    this.handleSearch();
  },
  methods: {
    //判断是否显示批注
    isShowPositl(tag) {
      return tag && this.$route.type !== 'entey';
    },
    removeAddress() {
      this.noticeForm.originalAddress = '';
    },
    /**
     * 编辑批注
     */
    editAnnotation(e) {
      this.curType = e.target.getAttribute('data-value');
      this.isShowAnnotation = true;
    },
    /**
     * 创建一个新的notice对象
     */
    createNewNoticeItem() {
      this.noticeForm = {
        name: '', //名称
        releaseMechanism: '', //发布机构
        style: '',
        identifyCode: '',
        tag: {},
        standards: [],
        literatureIds: [],
        releaseTime: '', //发布时间
        originalAddress: '' //原件
      };
    },
    /**
     *获取 item
     */
    getNoticeItem() {
      this.$http.noticeService.getNoticeById(this.curId).then((res) => {
        this.noticeForm = res.data;
        this.noticeForm.tag = this.noticeForm.tag || {};
        this.fileList = [
          { name: '源文件', url: this.noticeForm.originalAddress }
        ];
      });
    },
    /**
     * 时间转换函数
     */
    formatDate(now) {
      now = new Date(now);
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      if (date < 10) {
        date = '0' + date;
      }
      if (month < 10) {
        month = '0' + month;
      }
      return year + '-' + month + '-' + date;
    },
    /**
     * 下一步
     */
    goNext() {
      let flag = this.checkNoticeForm();
      if (flag) {
        this.$message.error('请填写名称和上传原文件');
        return;
      }
      this.noticeForm.releaseTime = new Date(
        this.noticeForm.releaseTime
      ).getTime();
      if (this.curId === '0') {
        //创建
        this.$http.noticeService.createNotice(this.noticeForm).then((res) => {
          this.curId = res.data;
          this.$router.push('/standardBank/addNoticeWordBar/' + this.curId);
        });
      } else if (this.curId !== '0' && this.method === 'noReview') {
        //修改
        this.$http.noticeService
          .updateNotice(this.curId, this.noticeForm)
          .then((res) => {
            this.$router.push('/standardBank/addNoticeWordBar/' + this.curId);
          });
      } else {
        //审核
        let tags = Object.assign(this.tags, this.noticeForm.tag);
        tags.identifier = this.curId;
        this.$http.noticeService.announcementsAudit(tags).then((res) => {
          this.$router.push('/standardBank/addNoticeWordBar/' + this.curId);
        });
      }
    },
    /**
     * 校验
     */
    checkNoticeForm() {
      let flag = false;
      if (
        this.noticeForm.name.trim() === '' ||
        this.noticeForm.originalAddress === ''
      ) {
        flag = true;
      }
      return flag;
    },
    /**
     * 上传图片
     */
    submitUpload() {
      this.$refs.upload.submit();
    },
    /**
     * 校验file
     */
    beforeUpload(file) {
      if (!/\.docx$/.test(file.name)) {
        this.$message.warning('请选择docx格式的文档');
        return false;
      }
      this.fileUpload(file);
      return false;
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
          _this.noticeForm.originalAddress = data;
          _this.isShowFileError = false;
        });
      };
    },
    /**
     *执行查询
     */
    handleSearch() {
      this.$http.standardService.getDataList(this.search).then((res) => {
        this.regulaData = res.data.content;
      });
    },
    /**
     *删除标准
     */
    removeStandar(e) {
      let itemid = e.target.getAttribute('itemid');
      this.noticeForm.standards = this.noticeForm.standards.filter((e) => {
        return e.id != itemid;
      });
      this.noticeForm.literatureIds = this.noticeForm.literatureIds.filter(
        (e) => {
          return e != itemid;
        }
      );
    },
    /**
     *校验
     */
    handleExceed() {
      this.$message.warning('只能选择一个文件，请删除后再选择');
    },
    /**
     * 删除
     */
    beforeRemove() {
      this.noticeForm.originalAddress = '';
    },
    /**
     * 展示dialog
     */
    showAddDialog() {
      this.checkedRegula = this.noticeForm.literatureIds;
      this.dialogVisible = true;
    },
    /**
     * 添加标准
     */
    addStandard() {
      this.noticeForm.standards = this.regulaData.filter((e) => {
        return this.checkedRegula.indexOf(e.id) !== -1;
      });
      this.noticeForm.literatureIds = this.noticeForm.standards.map((e) => {
        return e.id;
      });
      this.checkedRegula = [];
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.standard-search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.noticeEntry {
  width: 450px;
  margin: auto;
  background-color: #ffffff;
  box-sizing: border-box;
}
.bzbox {
  position: relative;
  margin-bottom: 2px;
  height: 40px;
  width: 86%;
  padding: 0 2em;
  box-sizing: border-box;
  line-height: 40px;
  background: rgba(247, 250, 255, 1);
  border-radius: 6px;
  .bzclose {
    float: right;
    margin-top: 1em;
    color: #9badcc;
    cursor: pointer;
  }
}
.annotation {
  height: 40px;
  line-height: 40px;
  padding-left: 2em;
  font-size: 12px;
}
</style>