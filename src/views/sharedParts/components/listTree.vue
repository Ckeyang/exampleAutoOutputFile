<template>
  <div class="listTree">
    <ul>
      <li v-for="(item, index) in data" :key="index">
        <el-popover trigger="hover" effect="light" :placement="position">
          <div>
            <span v-if="justEdit">
              名称：{{ item.name }}
              <br />
            </span>
            别名：{{ item.aliasNameList.join(",") || "无" }}
            <br />
            描述：{{ item.describe || "" }}
          </div>
          <span class="name" slot="reference" @click="chooseItem(item)">{{ item.name }}</span>
        </el-popover>
        <el-tag
          size="mini"
          type="info"
          v-for="j in item.markingIcon"
          :key="j"
          :class="{ wz: j === 'REPORT', xm: j === 'PROJECT' }"
          >{{ j === "REPORT" ? "报" : j === "PROJECT" ? "项" : "规" }}</el-tag
        >
        <el-tag v-if="item.shareComponentType === 'TEXT'" size="mini" style="margin-left:2px;" type="warning">字段</el-tag>
        <el-tag v-if="item.shareComponentType === 'IMAGE'" size="mini" style="margin-left:2px;" type="success">图片</el-tag>
        <table-box
          style="margin-left:2px;"
          v-if="item.shareComponentType === 'TABLE'"
          :ruleNode="item.tableHeadNode"
          :name="item.name"
          @chooseItem="chooseItem"
        ></table-box>
        <rule-box
          style="margin-left:2px;"
          v-else
          v-for="(jtem, index) in item.shareComponentRuleList"
          :key="index"
          @chooseItem="chooseItem"
          :name="jtem.type"
        ></rule-box>
        <!-- <RuleBox v-else v-for="(jtem,index) in item.ruleNode" :key="index" :ruleNode="jtem.ruleNode"  @chooseItem="chooseItem" :name="jtem.name+'规则'" ></RuleBox> -->
        <!-- <span class="tag">规则1</span> -->
        <!-- <el-row align="middle">
                <el-col :span="1">{{item.name}}</el-col>    
                <el-col :span="2">{{item.name}}</el-col>    
                <el-col :span="1">{{item.name}}</el-col>    
        </el-row>-->
        <div class="toolBar operation-icon" v-if="action">
          <i title="查看" class="iconfont icon-yulan" @click="chooseItem(item)">查看</i>
          <i
            title="规则配置"
            class="iconfont icon-guizeshezhi"
            @click="addRules(item.id)"
            v-if="
              item.markingIcon.indexOf('PROJECT') === -1 &&
                item.shareComponentType !== 'TABLE' &&
                checkAuth('RBAC_PERMISSION_api_app_shareComponent_{identifier}_rule_PUT')
            "
            >规则设置</i
          >
          <i
            v-if="checkAuth('RBAC_PERMISSION_api_app_shareComponent_{identifier}_PUT')"
            title="编辑"
            class="iconfont icon-xiugai"
            @click="editItem(item.id, item.markingIcon.indexOf('PROJECT') > -1)"
            >编辑</i
          >
          <i
            title="停用"
            v-if="
              item.enableOrDisable === 'ENABLE' &&
                !checkQuoteRelation(item.quoteRelation) &&
                checkAuth('RBAC_PERMISSION_api_app_shareComponent_changeState_{identifier}_PUT')
            "
            class="iconfont icon-tingyong"
            @click="stopUse(item)"
            >停用</i
          >
          <i
            title="启用"
            v-if="
              item.enableOrDisable === 'DISABLE' &&
                checkAuth('RBAC_PERMISSION_api_app_shareComponent_changeState_{identifier}_PUT')
            "
            class="iconfont icon-qiyong"
            @click="stopUse(item)"
            >启用</i
          >
          <i
            title="删除"
            v-if="
              checkQuoteRelation(item.quoteRelation) &&
                item.enableOrDisable === 'ENABLE' &&
                checkAuth('RBAC_PERMISSION_api_app_shareComponent_{id}_DELETE')
            "
            class="iconfont icon-shanchu"
            @click="deleteUse(item)"
            >删除</i
          >
        </div>
        <div class="toolBar operation-icon" v-if="justEdit">
          <i title="编辑" class="iconfont icon-xiugai" @click="editItem(item.id)">编辑</i>
        </div>
      </li>
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"></div>
    </ul>
  </div>
</template>
<script>
import RuleBox from "./ruleBox.vue";
import TableBox from "./tableBox.vue";
// import InfiniteLoading from 'vue-infinite-loading'; 滚动分页 https://www.cnblogs.com/tuspring/p/9803424.html
import { mapGetters } from "vuex";
let count = 0;
let timer = null;
export default {
  name: "listTree",
  components: { RuleBox, TableBox },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  props: {
    data: Array,
    totalNumber: { type: Number },
    totalPage: { type: Number },
    action: { type: Boolean, default: true },
    justEdit: { type: Boolean, default: false },
    position: { type: String, default: "bottom-start" }
  },
  watch: {
    totalPages(val) {
      this.resetCurrent();
    },
    totalNumber(val) {
      this.resetCurrent();
    }
  },
  data() {
    return {
      dataList: [],
      current: 0,
      size: 20
    };
  },
  methods: {
    resetCurrent() {
      this.current = 0;
      this.size = 20;
      this.dataList = [];
      this.loadMore();
    },
    loadMore() {
      if (this.totalPage > this.current) {
        this.current = this.current + 1;
        this.$emit("loadMore", { current: this.current, size: this.size });
      }
      // let list = this.data.slice(this.current, this.current + this.size);
      // this.dataList = this.dataList.concat(list);
      // this.current = this.current + this.size;
      // console.log("loadmore")
    },
    chooseItem(item) {
      count++;
      let that = this;
      timer = setTimeout(() => {
        clearTimeout(timer);
        count = 0;
        that.$emit("onClick", item);
      }, 300);
      if (count > 1) {
        clearTimeout(timer);
        count = 0;
        that.$emit("dbClick", item);
      }
    },
    checkQuoteRelation(t) {
      let flag = false;
      if (t && Object.keys(t).length === 0) {
        flag = true;
      }
      return flag;
    },
    stopUse(item) {
      let flag = item.enableOrDisable === "DISABLE" ? "ENABLE" : "DISABLE";
      if (item.quoteRelation) {
        let list = "";
        Object.values(item.quoteRelation)
          .map(item => {
            return { key: item.split("-")[0], value: item.split("-")[1] };
          })
          .map(item => {
            let url =
              item.key === "PROJECT" ? "/#/projectManagement/projectTemplateList" : "/#/reportTemplateManagement/list/all";
            list += "<li><a style='color:#26beff' href='" + url + "'>" + item.value + "</a><li>";
          });
        this.$notify({
          title: "",
          dangerouslyUseHTMLString: true,
          message: "<strong>此共享件正在被使用<strong>，使用的模板有:<br/>" + list,
          duration: 2500
        });
        // this.$message({
        //   type: "warning",
        //   dangerouslyUseHTMLString: true,
        //   message: "<strong>此共享件正在被使用<strong>，使用的模板有:<br/><br/>" + list.toString(),
        //   duration:2500
        // });
        return;
      }
      this.$confirm("此操作将" + (flag === "ENABLE" ? "启用" : "禁用") + "数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.sharedPartsService.stopUseSharedPart(item.id, flag).then(() => {
          this.$emit("onChange");
        });
      });
    },
    deleteUse(item) {
      this.$confirm("此操作将删除数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.sharedPartsService.deleteSharedPart(item.id).then(() => {
          this.$emit("onChange");
        });
      });
    },
    editItem(id, isflag) {
      this.$emit("onEdit", id, isflag);
    },
    //添加规则
    addRules(id) {
      this.$emit("addRules", id);
    }
  }
};
</script>
<style lang="scss" scoped>
.listTree {
  max-height: 60vh;
  overflow: auto;
  font-size: 14px;
  .icon-edit {
    cursor: pointer;
  }
  > ul > li:hover {
    background-color: #e6f9ff;
    border-left-color: #107ac2;
  }
  > ul > li {
    box-sizing: border-box;
    border-top: 1px solid rgba(232, 232, 232, 0.64);
    border-left: 2px solid transparent;
    border-radius: 0 6px 6px 0;
    padding: 0.5em 0.6em;
    position: relative;
    display: flex;
    align-items: center;
    .toolBar {
      position: absolute;
      right: 1em;
      display: inline-block;
    }
    .toolBar i {
      cursor: pointer;
    }
    .name {
      font-size: 14px;
      display: inline-block;
      position: relative;
      padding: 0.5em;
      cursor: pointer;
    }
    .label {
      font-size: 12px;
      display: inline-block;
      padding: 0.2em;
      margin: 0 0.2em;
    }
    .wz {
      background-color: rgba(61, 165, 244, 0.2); //#1d7fff;
      color: rgba(61, 165, 244, 1);
      border-color: rgba(61, 165, 244, 0.1);
      // border: 2px solid #1d7fff;
      // border-radius: 6px;
    }
    .gz {
      background-color: #a37aff;
      color: #fff;
      border: 2px solid #a37aff;
      border-radius: 6px;
    }
    .xm {
      background-color: rgba(24, 185, 212, 0.2); // #26beff;
      color: rgba(24, 185, 212, 1);
      border-color: rgba(24, 185, 212, 0.1);
      // border: 2px solid #26beff;
      // border-radius: 6px;
    }
    .tag {
      cursor: pointer;
      font-size: 12px;
      display: inline-block;
      padding: 0.2em 0.5em;
      background-color: #fff;
      color: #1d7fff;
      border: 2px solid #1d7fff;
      border-radius: 6px;
      margin: 0 0.2em;
    }
    .table {
      cursor: pointer;
      font-size: 12px;
      display: inline-block;
      padding: 0.2em 0.5em;
      background-color: #fff;
      color: #26beff;
      border: 2px solid #26beff;
      border-radius: 6px;
      margin: 0 0.2em;
    }
    .active {
      background-color: #26beff;
      color: #fff;
      border: 2px solid #26beff;
    }
    .tag:hover {
      background-color: #26beff;
      color: #fff;
      border: 2px solid #26beff;
    }
  }
}
</style>
