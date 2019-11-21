<template>
  <div style="height: 100%;" class="regulation-tb box-style_common">
    <div class="tools-bar_common">
      <h5 class="table-title">审核通知</h5>
    </div>
    <ul class="examine-box" @click="handleCorrections">
      <li>
        <span class="label">通知名称</span>
        <p>{{data.name}}</p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.noticeNameTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-name="通知名称" data-type="name"
            data-value="noticeNameTag">{{!correctionsValue.noticeNameTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li>
        <span class="label">发布机构</span>
        <p>{{data.releaseMechanism}}</p>
        <div>
          <i class="iconfont icon-pishi" data-name="发布机构" :class="correctionsValue.releaseMechanismTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'"
            data-type="releaseMechanism" data-value="releaseMechanismTag">{{!correctionsValue.releaseMechanismTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li>
        <span class="label">文体</span>
        <p>{{data.style}}</p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.styleTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-name="文体" data-type="style"
            data-value="styleTag">{{!correctionsValue.styleTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li>
        <span class="label">发布号</span>
        <p>{{data.identifyCode}}</p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.postNoTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-name="发布号" data-type="identifyCode"
            data-value="postNoTag">{{!correctionsValue.postNoTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li>
        <span class="label">发布时间</span>
        <p>
          <span>{{data.releaseTime}}</span>
        </p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.releaseTimeTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-name="发布时间" data-type="releaseTime"
            data-value="releaseTimeTag">{{!correctionsValue.releaseTimeTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li style="overflow: hidden;height:auto">
        <span class="label">关联法规</span>
        <el-popover placement="top-start" width="300" trigger="click">
          <div v-for="(item,index) of reglationsData" :key="index" property="item" style="margin-bottom:5px">{{index+1}}. {{item}}</div>
          <p slot="reference" style="cursor:pointer"  ><span class='relations'>点击查看</span></p>
        </el-popover>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.statuteIdsTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-type=""
            data-name="关联法规" data-value="statuteIdsTag">{{!correctionsValue.statuteIdsTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li>
        <span class="label">原件</span>
        <p class="checkWords">
          <preview :url="data.originalAddress" name="查看原件"></preview>
        </p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.originalAddressTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-type="" data-name="原件"
            data-value="originalAddressTag">{{!correctionsValue.originalAddressTag?"批注":"已批注"}}</i>
        </div>
      </li>
    </ul>
    <div class="btn-box">
      <el-button type="primary" size='medium' @click="handleNext">下一步</el-button>
    </div>
    <!-- 审核对话框 -->
    <div>
      <el-dialog title="通知审核" :visible.sync="dialogVisible" width="30%">
        <el-row v-if="data[dialogText.dataType]">
          <el-col style="text-align: right;width:62px;">
            <span>{{dialogText.name}}:</span>
          </el-col>
          <el-col :span="17">
            <span>&nbsp;&nbsp;&nbsp;{{data[dialogText.dataType]}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col style="text-align: right;margin-right: 14px;width:62px;">
            <span>批注:</span>
          </el-col>
          <el-col :span="17">
            <el-input type="textarea" :rows="5" placeholder="请输入批注内容" v-model="correctionsValueModel">
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog" size='medium'>取 消</el-button>
          <el-button type="primary" @click="Determine" size='medium'>保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import preview from '@/components/tools/Preview.vue';
import { mapGetters } from 'vuex';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  data() {
    return {
      data: {}, //通知数据
      reglationsData: [], //关联的法规
      dialogVisible: false,
      dialogText: {
        //当前展示项的内容
        name: '',
        dataType: '', //dataType为对应数据的字段名
        corrType: '' //dataType为对应批注的字段名
      },
      correctionsValueModel: '',
      correctionsValue: {
        noticeNameTag: '',
        releaseMechanismTag: '',
        styleTag: '',
        releaseTimeTag: '', //发布时间
        postNoTag: '',
        statuteIdsTag: '', //法规
        originalAddressTag: ''
      }
    };
  },
  components: {
    preview
  },
  activated() {
    this.getNotice();
  },
  methods: {
    //打开对话框
    handleCorrections(e) {
      if (e.target.tagName == 'I') {
        this.dialogVisible = true;
        this.dialogText.name = e.target.getAttribute('data-name');
        this.dialogText.dataType = e.target.getAttribute('data-type');
        this.dialogText.corrType = e.target.getAttribute('data-value');
        this.correctionsValueModel = this.correctionsValue[this.dialogText.corrType];
      }
    },
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.dialogText = {
        name: '',
        type: ''
      };
    },
    //确定批注
    Determine() {
      this.correctionsValue[this.dialogText.corrType] = this.correctionsValueModel;
      this.closeDialog();
    },
    //获取通知基本信息
    getNotice() {
      this.$http.statute.getReglationAddNotices(this.$route.params.id).then((res) => {
        this.data = res.data.notice;
        this.data.releaseTime = this.data.releaseTime ? this.formatDate(new Date(this.data.releaseTime)) : '未知';
        // this.correctionsValue = {
        //   //批改的值
        //   noticeNameTag: this.data.nameTag,
        //   releaseMechanismTag: this.data.releaseMechanismTag,
        //   styleTag: this.data.styleTag,
        //   releaseTimeTag: this.data.releaseTimeTag,
        //   postNoTag: this.data.identifyCodeTag,
        //   statuteIdsTag: this.data.literatureIdsTag,
        //   originalAddressTag: this.data.originalAddressTag
        // };
        this.reglationsData = res.data.statute.map((item) => {
          return item.name;
        });
      });
    },
    //下一步
    handleNext() {
      this.correctionsValue.identifier = this.$route.params.id;
      this.$confirm('此操作将提交批示数据, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(this.correctionsValue);
          this.$http.statute
            .examineNotice(this.correctionsValue)
            .then((res) => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration: 2000
              });
              this.$router.push(`/statuteBank/addNoticeApproval/${this.$route.params.id}/${this.data.name}`);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });
        });
    },
    //时间转换函数
    formatDate(now) {
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
    }
  }
};
</script>
<style scoped>
.label {
  display: block;
  width: 56px;
  color: rgba(93, 104, 122, 1);
  float: left;
  text-align: right;
  margin: 0 50px 0 0px;
}
.checkWords a:hover,
.relations:hover{
  color: #1D7FFF
}
.relations,
.checkWords a{
  color: #26beff;
}
.examine-box {
  line-height: 45px;
  font-size: 14px;
  width: 630px;
  padding-top: 16px;
}
 

.examine-box li {
  height: 45px;
  margin-left: 100px;
}

.examine-box li p {
  width: 360px;
  height: 40px;
  float: left;
}

.examine-box li i {
  cursor: pointer;
  font-size: 12px;
  font-family: '微软雅黑';
}

.examine-box li i::before {
  margin-right: 10px;
}

.examine-box li i:hover {
  color: #26beff;
}

.btn-box {
  width: 600px;
  margin-top: 30px;
  text-align: center;
}

.btn-box button {
  margin-right: 30px;
}
.icon-pishi {
  color: #26beff;
}

.icon-pigai_tianjiapizhu {
  color: #848d9b;
}
</style>