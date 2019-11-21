<template>
        <el-dialog
        :visible.sync="visible"
        :width="width||'30%'"
        :modal-append-to-body='onBody||true'
        title="查看共享件"
        >
        <!-- <el-form label-width="120px">
            <el-form-item label="名称">
                <span>{{data.name}}</span>
            </el-form-item>
        </el-form> -->
        <el-row class="tb_1em">
            <el-col :span="6"><span class="label">名称</span></el-col>
            <el-col :span="18"><span class="content">{{data.name}}</span></el-col>
        </el-row>
        <el-row class="tb_1em">
            <el-col :span="6"><span class="label">状态</span></el-col>
            <el-col :span="18"><span class="content">{{data.enableOrDisable==='ENABLE'?'启用':'停用'}}</span></el-col>
        </el-row>
        <el-row class="tb_1em">
            <el-col :span="6"><span class="label">版本</span></el-col>
            <el-col :span="18"><span class="content">{{data.version}}</span></el-col>
        </el-row>
        <el-row class="tb_1em">
            <el-col :span="6"><span class="label">别名</span></el-col>
            <el-col :span="18"><span class="content">{{data.aliasNameList?data.aliasNameList.join('，  '):'无'}}</span></el-col>
        </el-row>
        <el-row class="tb_1em">
            <el-col :span="6"><span class="label">描述</span></el-col>
            <el-col :span="18"><span class="content">{{data.describe}}</span></el-col>
        </el-row>
        <el-row class="tb_1em">
            <el-col :span="6"><span class="label">类型</span></el-col>
            <el-col :span="18"><span class="content">{{data.shareComponentType==='TABLE'?'表格':data.shareComponentType==='TEXT'?'普通字段':'图片'}}</span></el-col>
        </el-row>
        <el-row  class="tb_1em">
          <el-col :span="6"><span class="label">使用场景</span></el-col>
            <el-col :span="18"><span class="content">{{data.quoteName?data.quoteName.join(', '):''}}</span></el-col>
        </el-row>
        <el-row class="tb_1em">
            <el-col :span="6"><span class="label">规则配置情况</span></el-col>
            <el-col :span="18"><span class="content">{{data.aliasName}}</span></el-col>
        </el-row>
        <el-row class="tb_1em" v-for="(j,index) in data.shareComponentVersionsList" :key="index">
            <el-col :span="6"><span class="label">字段变更记录{{index+1}}</span></el-col>
            <el-col :span="18"><span class="content">版本:{{j.version}}, 操作人:{{j.accountInfo}}, 时间:{{j.date}},{{j.describe}}</span></el-col>
        </el-row>
        </el-dialog>
</template>
<script>
export default {
  name: 'detail',
  props: { width: String, detailId: String, onBody: Boolean },
  watch: {
    detailId(val) {
      this.getDetail(val);
    }
  },
  data() {
    return {
      data: {},
      visible: false
    };
  },
  methods: {
    isShow() {
      this.visible = true;
    },
    getDetail(id) {
      this.$http.sharedPartsService.getSharePartById(id).then((res) => {
        this.data = res.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.label {
  font-size: 16px;
  color: #68788c;
}
.content {
  font-size: 14px;
  font-weight: 120;
}
.tb_1em {
  padding: 0.5em 1em;
}
</style>
