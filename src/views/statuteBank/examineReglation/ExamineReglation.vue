<template>
  <div class="regulation-tb box-style_common" style="height:100%">
    <div class="tools-bar_common">
        <h5 class="table-title">审核法规</h5>
    </div>
    <ul class="examine-box" @click="handleCorrections">
      <li>
        <span class="label">法规名称</span>
        <p>{{data.name}}</p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.statuteNameTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-name="法规名称" data-type="name"
            data-value="statuteNameTag">{{!correctionsValue.statuteNameTag?"批注":"已批注"}}</i>
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
      <li>
        <span class="label">生效时间</span>
        <p>
          <span>{{data.effectTime}}</span>
        </p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.effectTimeTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-name="生效时间" data-type="effectTime"
            data-value="effectTimeTag">{{!correctionsValue.effectTimeTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li>
        <span class="label">发布范围</span>
        <p>{{data.rangeApplication}}</p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.rangeApplicationTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-type="rangeApplication"
            data-name="发布范围" data-value="rangeApplicationTag">{{!correctionsValue.rangeApplicationTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <li>
        <span class="label">行业分类</span>
        <p>{{data.industryClassification}}</p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.industryClassificationTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-type="industryClassification"
            data-name="行业分类" data-value="industryClassificationTag">{{!correctionsValue.industryClassificationTag?"批注":"已批注"}}</i>
        </div>
      </li>
      <!-- <li>
        <span class="label">原件</span>
        <p>
          <preview :url="data.originalAddress" name="查看原件"></preview>
        </p>
        <div>
          <i class="iconfont icon-pishi" :class="correctionsValue.name ? 'icon-pishi':'icon-pigai_tianjiapizhu'" data-type="" data-name="原件" data-value="">{{correctionsValue.industryClassificationTag?"批注":"已批注"}}</i>
        </div>
      </li> -->
    </ul>
    <div class="btn-box">
      <el-button type="primary" @click="handleNext" size='medium'>下一步</el-button>
    </div>
    <!-- 审核对话框 -->
    <div>
      <el-dialog title="法规审核" :visible.sync="dialogVisible" width="30%">
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
import { mapGetters } from 'vuex';
import preview from '@/components/tools/Preview.vue';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  data() {
    return {
      data: {},
      dialogVisible: false,
      routerData: '',
      dialogText: {
        //当前展示项的内容
        name: '', //类型
        dataType: '', //dataType为对应数据的字段名
        corrType: '' //dataType为对应批注的字段名
      },
      correctionsValueModel: '',
      correctionsValue: {
        //批改的值
        effectTimeTag: '', // 生效时间批注 ,
        identifier: '',
        industryClassificationTag: '', //行业分类批注 ,
        postNoTag: '', // 发布号批注 ,
        rangeApplicationTag: '', // 应用范围批注 ,
        releaseMechanismTag: '', // 发布机构批注 ,
        releaseTimeTag: '', // 发布时间批注 ,
        statuteNameTag: '', // 法规名称批注 ,
        styleTag: '' // 文体批注"
      }
    };
  },
  components: {
    preview
  },
  activated() {
    if (this.routerData !== this.$route.params.id) {
      this.routerData == this.$route.params.id;
      this.getDataList(this.$route.params.id);
    }
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
    //根据id获取法规信息
    getDataList(id) {
      this.$http.statute.getDataById(id).then((res) => {
        this.data = res.data;
        this.data.effectTime = this.data.effectTime ? this.formatDate(new Date(this.data.effectTime)) : '';
        this.data.releaseTime = this.data.releaseTime ? this.formatDate(new Date(this.data.releaseTime)) : '';
      });
    },
    //下一步
    handleNext() {
      this.correctionsValue.identifier = this.data.id;
      let params = {
        name: this.data.name,
        identifier: this.data.id
      };
      this.$confirm('此操作将提交批示数据, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.statute.reglationExaminePostil(this.correctionsValue).then((res) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            this.$router.push(`/statuteBank/addReglationApproval/${JSON.stringify(params)}`);
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
  text-indent: right;
  margin: 0 20px 0 0px;
}

.examine-box {
  line-height: 45px;
  font-size: 14px;
  padding-top: 16px;
}

.examine-box li {
  height: 45px;
  margin-left: 100px;
}

.examine-box li p {
  min-width:410px;
  height: 40px;
  float: left;
  margin-right: 20px;
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
  margin-top: 40px;
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