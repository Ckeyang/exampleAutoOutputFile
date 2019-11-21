<template>
  <div class="groupTem">
    <div class="groupTemtitle">
      <el-select
        size="mini"
        v-if="index != 0"
        style="width:100px;"
        @change="$emit('connectGroup')"
        v-model="model.previous.connectionType"
      >
        <el-option label="并且" value="AND"></el-option>
        <el-option label="或者" value="OR"></el-option>
      </el-select>
      <span class="groupTitle">分组{{ index + 1 }}</span>
      <i class="iconfont icon-shanchu" @click="$emit('removeGroup', index)"></i>
    </div>
    <div class="groupTemBox">
      <div style="text-align:center" v-if="model.expressions.length === 0">
        <i class="iconfont icon-jia" @click="addExpression"></i>
      </div>
      <div v-else>
        <div v-for="(item, i) in model.expressions" :key="i" class="flexBox">
          <el-select
            size="mini"
            style="width:100px"
            v-show="i != 0"
            @change="connectExpression"
            v-model="item.previous.connectionType"
          >
            <el-option label="并且" value="AND"></el-option>
            <el-option label="或者" value="OR"></el-option>
          </el-select>
          <el-select
            size="mini"
            style="width:100px"
            v-model="item.expressionType"
            @change="
              item.leftSide = '';
              item.rightSide = '';
            "
          >
            <el-option label="控件" value="COMPONENT"></el-option>
            <el-option label="系统" value="USER"></el-option>
          </el-select>
          <el-select
            size="mini"
            style="width:100px"
            filterable
            v-model="item.leftSide"
            v-if="mode === 'from' && item.expressionType === 'COMPONENT'"
          >
            <el-option v-for="(jtem, j) in componentList" :key="j" :label="jtem.name" :value="jtem.id"></el-option>
          </el-select>
          <el-select
            size="mini"
            style="width:100px"
            filterable
            @change="getCompentId"
            v-if="item.expressionType === 'COMPONENT' && mode === 'normal'"
            v-model="item.leftSide"
          >
            <el-option
              v-for="(jtem, j) in componentList"
              :key="j"
              :label="jtem.name || jtem.tag"
              :value="jtem.fieldId"
            ></el-option>
          </el-select>
          <el-select size="mini" v-if="item.expressionType !== 'COMPONENT'" v-model="item.leftSide" style="width:100px">
            <el-option label="角色" value="ROLE"></el-option>
            <el-option label="部门" value="DEPARTMENT"></el-option>
          </el-select>
          <el-select size="mini" v-model="item.operator" style="width:100px">
            <el-option label="=" value="="></el-option>
            <el-option label=">=" value=">="></el-option>
            <el-option label="<=" value="<="></el-option>
            <el-option label=">" value=">"></el-option>
            <el-option label="<" value="<"></el-option>
            <el-option label="≠" value="!="></el-option>
            <el-option label="包含" value="CONTAINS"></el-option>
            <el-option label="不包含" value="NOT_CONTAINS"></el-option>
            <el-option label="为空" value="IS_EMPTY"></el-option>
            <el-option label="不为空" value="IS_NOT_EMPTY"></el-option>
          </el-select>
          <el-input
            v-if="
              item.operator != 'IS_EMPTY' &&
                item.operator != 'IS_NOT_EMPTY' &&
                (item.operator === 'CONTAINS' ||
                  item.operator === 'NOT_CONTAINS' ||
                  (item.leftSide !== 'ROLE' && item.leftSide !== 'DEPARTMENT' && !isSelect(item.leftSide)))
            "
            v-model.trim="item.rightSide"
            size="mini"
            style="width:130px"
          ></el-input>
          <!-- <el-select
            v-if="item.operator!='IS_EMPTY'&&item.operator!='IS_NOT_EMPTY'&&item.operator!='CONTAINS'&&item.operator!='NOT_CONTAINS'&&item.leftSide !== 'ROLE' && item.leftSide !== 'DEPARTMENT' && isSelect(item.leftSide)"
            size="mini"
            filterable
            style="width:100px"
            v-model="item.rightSide"
          >
            <el-option
              v-for="(jtem, j) in getSystemList(item.leftSide)"
              :key="j"
              :label="jtem.choiceValue"
              :value="jtem.choiceValue"
            ></el-option>
          </el-select> -->
          <el-input
            v-if="
              item.operator != 'IS_EMPTY' &&
                item.operator != 'IS_NOT_EMPTY' &&
                item.operator != 'CONTAINS' &&
                item.operator != 'NOT_CONTAINS' &&
                item.leftSide !== 'ROLE' &&
                item.leftSide !== 'DEPARTMENT' &&
                isSelect(item.leftSide)
            "
            size="mini"
            v-model="item.rightSideValue"
            disabled
            style="width:130px"
          >
            <i slot="append" class="iconfont icon-xuanze" @click="openSystemBox(item)"></i>
          </el-input>
          <el-select
            v-if="
              item.operator != 'IS_EMPTY' &&
                item.operator != 'IS_NOT_EMPTY' &&
                item.operator != 'CONTAINS' &&
                item.operator != 'NOT_CONTAINS' &&
                item.leftSide === 'ROLE'
            "
            filterable
            size="mini"
            style="width:130px"
            v-model="item.rightSide"
          >
            <el-option v-for="(jtem, j) in roolList" :key="j" :label="jtem.name" :value="jtem.id"></el-option>
          </el-select>
          <select-tree
            style="width:130px;"
            size="mini"
            v-if="
              item.operator != 'IS_EMPTY' &&
                item.operator != 'IS_NOT_EMPTY' &&
                item.operator != 'CONTAINS' &&
                item.operator != 'NOT_CONTAINS' &&
                item.leftSide === 'DEPARTMENT'
            "
            v-model="item.rightSide"
            autocomplete="false"
            tipText="选择部门"
            :treeData="departmentList"
          />
          <!-- <el-select v-if="item.leftSide==='DEPARTMENT'" style="width:100px" v-model="item.rightSide">
                      <el-option v-for="(jtem,j) in roolList" :key="j" :label="jtem.name" :value="jtem.id"></el-option>
          </el-select>-->
          <div style="display:inline-block;width:80px;text-align:center;">
            <i class="iconfont icon-jia" @click="addExpression()"></i>
            &nbsp;&nbsp;
            <i class="iconfont icon-jian" v-if="i != 0" @click="removeExpression(i)"></i>
            <i class="iconfont" v-else>&nbsp;&nbsp;&nbsp;</i>
          </div>
        </div>
      </div>
    </div>
    <el-dialog ref="keyword" :visible.sync="visibleBox" title="选择数据" width="30%">
      <div>
        <div>
          <el-row type="flex" justify="space-around">
            <el-col :span="4">关键词</el-col>
            <el-col><el-input v-model="keyWords" size="small"></el-input></el-col>
          </el-row>
        </div>
        <div style="height:200px;overflow:auto;border-radius:6px;border:1px solid #E8E8E8;padding:0 1em;margin-top:1em;">
          <el-checkbox-group v-model="chooseItems">
            <el-checkbox
              v-for="(item, index) in filterList()"
              :key="index"
              :label="item.choiceValue"
              :value="item.choiceValue"
            ></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleBox = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateData" :disabled="chooseItems.lengh === 0" size="small">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {guid} from "@/utils.js"
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SelectTree from "@/components/tools/selectTree.vue";
export default {
  name: "group",
  props: {
    index: { type: Number, default: 0 },
    model: Object,
    mode: { type: String, default: "normal" },
    templateId: String,
    componentId: String,
    componentList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: { Treeselect, SelectTree },
  data() {
    return {
      visibleBox: true,
      keyWords: "",
      timer: null,
      curItem: {},
      shareList: [],
      roolList: [],
      chooseItems: [],
      dataList: [],
      // systemList: [],
      // curItem: {},
      departmentList: []
    };
  },
  watch: {
    model: {
      handler(newValue, oldValue) {
        if (oldValue && newValue && newValue !== oldValue) {
          this.$emit("update:model", newValue);
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getSharePartsList();
    this.getRoolList();
    this.getDepartment();
    this.model.expressions.length !== 0 ? null : this.addExpression();
    this.visibleBox = false;
  },
  methods: {
    openSystemBox(item) {
      this.curItem = item;
      this.chooseItems = item.rightSide ? [item.rightSide] : [];
      this.visibleBox = true;
      this.dataList = [];
      this.getTemplateChoiceItems(item.leftSide);
    },
    updateData() {
      let item = this.dataList.find(item => {
        if (item.choiceId === this.chooseItems[0] || item.choiceValue === this.chooseItems[0]) {
          return item;
        }
      });
      this.curItem.rightSide = item.choiceId || item.choiceValue;
      this.curItem.rightSideValue = item.choiceValue;
      if (this.chooseItems.length > 0) {
        this.chooseItems.splice(0, 1);
        let list = this.dataList.filter(item => {
          if (this.chooseItems.indexOf(item.choiceValue) > -1) {
            return item;
          }
        });
        list.map(item => {
          let { expressionType, leftSide, next, operator, previous, rightSide } = this.curItem;
          let obj = JSON.parse(JSON.stringify({ expressionType, leftSide, next, operator, previous, rightSide }));
          obj.id = this.getRoundId();
          obj.rightSide = item.choiceId || item.choiceValue;
          obj.rightSideValue = item.choiceValue;
          this.model.expressions.push(obj);
        });
      }
      this.visibleBox = false;
      this.dataList = [];
      this.chooseItems = [];
      this.curItem = {};
      setTimeout(this.connectExpression, 1500);
    },
    getSystemList(id) {
      let item = this.componentList.find(item => {
        if (item.identifier === id) {
          return item;
        }
      });
      return item.choiceItemsChoiceBox;
    },
    getTemplateChoiceItems(id) {
      let item = this.componentList.find(item => {
        if (item.fieldId === id) {
          return item;
        }
      });
      this.$http.ruleService.getTemplateChoiceItems(this.$route.params.tempId, item.identifier).then(res => {
        // console.log(res.data);
        this.dataList = res.data;
      });
    },
    filterList() {
      return this.dataList.filter(item => {
        if (item.choiceValue.indexOf(this.keyWords) > -1) {
          return item;
        }
      });
    },
    //choiceDynamicDataConfig.choiceDynamicDataType!='FORM_DATA'
    isSelect(id) {
      if (!id || this.componentList.length === 0 || this.mode === "from") {
        return;
      }
      if (this.componentList.length === 0) {
        window.clearTimeout(this.timer);
        this.timer = null;
        this.timer = setTimeout(() => this.$message.error("新建分组不成功，没有控件"), 500);
        return;
      }
      window.clearTimeout(this.timer);
      this.timer = null;
      let item = this.componentList.find(item => {
        if (item.fieldId === id) {
          return item;
        }
      });
      return (
        item &&
        ((item.componentType === "CHECKBOX" ||
          item.componentType === "RADIOBOX" ||
          item.componentType === "COMBOBOX" ||
          item.componentType === "MULTIPLE_COMBOBOX") &&
          (item.choiceItemsType != "FIXED_ITEMS" ? item.choiceDynamicDataConfig.choiceDynamicDataType != "FORM_DATA" : true))
      );
    },
    getCompentId() {
      let list = this.model.expressions.find(item => {
        if (item.expressionType === "COMPONENT") {
          return item;
        }
      });
      let item = this.componentList.find(item => {
        if (item.fieldId === list.leftSide) {
          return item;
        }
      });
      // this.curItem = item;
      // this.systemList = item.componentAttr.choiceItemsChoiceBox;
      this.$emit("changeComponentId", item ? item.parentId : "");
    },
    getTreeSet() {
      return {
        label: "name",
        children: "children"
      };
    },
    connectExpression() {
      let length = this.model.expressions.length;
      let i = 0;
      while (true) {
        if (i === length) {
          break;
        }
        this.execConnect(i, i+1);
        i++
      }
      // return this.model;
    },
    execConnect(index, nextIndex) {
      this.model.expressions[index].next.connectionType = this.model.expressions[nextIndex]
        ? this.model.expressions[nextIndex].previous.connectionType
        : "AND";
      this.model.expressions[index].next.id = this.model.expressions[nextIndex] ? this.model.expressions[nextIndex].id : "";
      // this.model.expressions[nextIndex]
      //   ? (this.model.expressions[nextIndex].previous.id = this.model.expressions[index].id)
      //   : null;
    },
    getRoolList() {
      this.$http.userService.getRoolList({ pageSize: 1000, current: 0 }).then(res => {
        this.roolList = res.data.content;
      });
    },
    getDepartment() {
      this.$http.userService.getDepartmentTree().then(res => {
        this.departmentList = this.filterChildren(res.data || []);
      });
    },

    /**
     * 过滤空 的children
     */
    filterChildren(array) {
      let result = [];
      array.map(item => {
        let obj = {
          id: item.id,
          name: item.name,
          parentId: item.parentId,
          parentName: item.parentName
        };
        if (item.children != null) {
          obj.children = this.filterChildren(item.children);
        }
        result.push(obj);
      });
      return result;
    },
    getRoundId() {
      return guid();
    },
    removeExpression(index) {
      this.model.expressions.splice(index, 1);
    },
    addExpression() {
      if (!this.componentList || this.componentList.length === 0) {
        this.$message.error("新建分组不成功，没有控件");
        return;
      }
      this.model.expressions.push({
        expressionType: "COMPONENT",
        id: this.getRoundId(),
        leftSide: "",
        next: {
          connectionType: "AND",
          id: ""
        },
        operator: "=",
        previous: {
          connectionType: "AND",
          id: ""
        },
        rightSide: null,
        roleImpactResult: false
      });
      this.connectExpression();
    }
  }
};
</script>
<style lang="scss" scoped>
.vue-treeselect__control {
  height: 28px !important;
  line-height: 28px !important;
}
.groupTem {
  border: 1px solid #d5e0ed;
  border-radius: 6px;
  margin-top: 13px;
  .groupTemtitle {
    height: 40px;
    padding: 0 25px 0 15px;
    position: relative;
    background-color: #f7fbff;
    border-bottom: 1px solid #d5e0ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .groupTitle {
      font-size: 12px;
      font-weight: bold;
    }
  }
  .groupTemBox {
    padding: 0.5em;
    .flexBox {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .el-checkbox:hover {
    background-color: #e6f9ff;
  }
}
</style>
