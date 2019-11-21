<template>
    <div>
        <div class="regulation-tb">
        <el-row>
          <el-col class="box" :span='4'>
            <div class="box" style="height:80vh;background:#fff">
              <el-input
                placeholder="输入关键字进行过滤"
                size="mini"
                v-model="filterTree">
              </el-input>
              <div style="height:10px;"></div>
              <el-tree
                @node-click="chooseMaterialType"
                :data="materialTypeTree"
                class="tree-name"
                accordion
                ref="tree"
                default-expand-all
                :props="{id:'id',label:'name',children:'subclass'}"
                :filter-node-method="filterNode">
              </el-tree>  
            </div>
          </el-col>
          <el-col class="box" :span='20'>
              <div class="search-box">
                  <el-form :model="form" label-width="70px">
                      <el-row type="flex" class="search-row" justify="start">
                              <div>
                              <el-form-item label="模板名称">
                                  <el-input v-model="form.name" size="medium"  clearable></el-input>
                              </el-form-item>
                              </div>
                              <div>
                              <el-form-item label="创建人">
                                  <el-input v-model="form.author" size="medium" clearable></el-input>
                              </el-form-item>
                              </div>
                              <div>
                              <el-form-item label="绑定状态">
                                  <el-select v-model="form.hasBinding" size="medium" >
                                    <el-option value="" label="全部"></el-option>
                                    <el-option :value="true" label="绑定"></el-option>
                                    <el-option :value="false" label="未绑定"></el-option>
                                  </el-select>
                              </el-form-item>
                              </div>
                              <div>
                              <el-button type="primary" size="medium"  icon="el-icon-search" round @click="getDataList">搜索</el-button>
                              <el-button type="info" size="medium"  icon="el-icon-refresh" round @click="resetForm">重置</el-button>
                              </div>
                      </el-row>
                  </el-form>
              </div>
              <el-table :data="dataList">
               <el-table-column type="index" width="100" label="序号"></el-table-column>
               <el-table-column prop="name" label="模板名称"></el-table-column>
               <el-table-column prop="groupId" label="模板类别"></el-table-column>
               <el-table-column prop="createdBy" label="创建人"></el-table-column>
               <el-table-column prop="lastUpdate" width="150" label="编辑时间" :formatter="translateTime"></el-table-column>
               <el-table-column prop="description" label="描述"></el-table-column>
               <el-table-column label="操作" width="200" fixed="right">
                 <template  slot-scope="scope">
                    <div class="operation-icon">
                      <i class="iconfont icon-chakan icon-edit" @click="goPrintPreview(scope.row.id)">查看</i>
                      <i class="iconfont icon-xiugai icon-edit" @click="openWindow(scope.row.id,scope.row.evaluationCategory)">修改</i>
                      <i class="iconfont icon-shanchu icon-edit" @click="doDeleteTemplate(scope.row.id)">删除</i>
                    </div>
                 </template>
               </el-table-column>
              </el-table>
              <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ></pagniation>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
import highlightWords from '@/components/tools/HighlightWords.vue';
import pagniation from '@/components/tools/Pagniation.vue';
import preview from '@/components/tools/Preview.vue';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'substanceTemplateList',
  components: { Treeselect, highlightWords, pagniation, preview },
  data() {
    return {
      filterTree: '',
      totalPage: 0,
      totalNum: 0,
      form: {
        author: '',
        name: '',
        hasBinding: '',
        categoryType: '',
        pageSize: 30,
        current: 0
      },
      dialogVisible: true,
      curId: '',
      dataList: [], //table
      materialTypeTree: [] //物质类别树
    };
  },
  watch: {
    filterTree(val) {
      this.$refs.tree.filter(val);
    }
  },
  activated() {
    this.getDataList();
    this.getMaterialTypeList();
  },
  methods: {
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    translateTime(row, column) {
      let now = new Date(row.lastUpdate);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      if (date < 10) {
        date = '0' + date;
      }
      if (month < 10) {
        month = '0' + month;
      }
      return year + '-' + month + '-' + date;
    },
    /**
     * 获取树设置
     */
    getMaterialTreeSet(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.subclass
      };
    },
    /**
     * 获取rule
     */
    getRules() {
      return this.rules.one;
    },
    /**
     * 过滤节点
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     * 打开新窗口
     */
    openWindow(tempId = 0, evaluationCategory) {
      let localPath =
        location.href.split(this.$route.path)[0] +
        '/template/' +
        0 +
        '/' +
        tempId +
        '/' +
        evaluationCategory.split('-')[0] +
        '-' +
        evaluationCategory.split('-')[1] +
        '/SUBSTANCE';
      window.open(localPath);
    },
    //打印预览
    goPrintPreview(projectId = 0) {
      let localPath =
        location.href.replace(this.$route.path, '') +
        '/printPreviewForm/' +
        projectId;
      window.open(localPath);
    },
    /**
     * 选择物质类别
     */
    chooseMaterialType(item) {
      this.form.categoryType = item.id;
      this.getDataList();
    },
    /**
     * 获取dataList
     */
    getDataList() {
      this.$http.materialService
        .getMaterialTemplateList(this.form)
        .then((res) => {
          this.dataList = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        });
    },
    getMaterialTypeList() {
      this.$http.materialService.getMaterialTypeList().then((res) => {
        this.materialTypeTree = res.data;
      });
    },
    /**
     * 删除模板
     */
    doDeleteTemplate(id) {
      this.$confirm('是否删除此模板?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.projectService.deleteTemplate(id).then(() => {
          this.$message({ type: 'success', message: '删除成功' });
          this.getDataList();
        });
      });
    },
    resetForm() {
      this.form = {
        user: '',
        name: '',
        status: '',
        materialType: '',
        pageSize: 30,
        current: 0
      };
      this.getDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.tree-name {
  color: rgba(52, 58, 69, 1);
  font-size: 12px;
}
.box {
  padding: 0.5em;
}
.el-tree {
  background: none;
}
.search-row {
  border-bottom: 1px solid #edf1f7;
  padding: 15px;
  line-height: 40px;
  background: #fff;
  height: 40px;
  box-sizing: content-box;
}
.search-row > div {
  text-align: center;
  margin: 0 0.5em;
  width: 200px;
}
.search-row > div:nth-last-child(1) {
  text-align: center;
  width: 250px;
}
.tools-bar {
  margin: 18px 0;
  overflow: hidden;
}

.tools-bar .tb-title {
  color: #343a45;
  font-weight: bold;
  width: 120px;
  display: inline-block;
  border-left: 3px solid #26beff;
  padding-left: 15px;
}
</style>