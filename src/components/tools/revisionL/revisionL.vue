<template>
  <div class="rules-box">
    <el-button
      size="mini"
      v-if="isShowCreat"
      icon="iconfont icon-tianjia"
      style="margin:0 0 10px 15px;float:right"
      @click="createRule"
      >新增规则</el-button
    >
    <div class="table-box app-container">
      <el-table :data="model" style="width: 100%" border size="mini">
        <el-table-column prop="name" label="名称（点击修改）" width="230px">
          <template slot-scope="scope">
            <span
              v-if="!isEdit(scope.row)"
              @click="
                scope.row.oldName = scope.row.name;
                addEdit(scope.row);
              "
              style="cursor:pointer"
              >{{ scope.row.name }}</span
            >
            <div class="edit-name_box" v-else>
              <el-input v-model="scope.row.name" style="width:150px" size="mini" placeholder="请输入名称" clearable></el-input>
              &nbsp;&nbsp;
              <el-tooltip class="item" effect="dark" content="确定" placement="top">
                <i class="iconfont icon-baocun" @click=" removeEdit(scope.row);"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="取消" placement="top">
                <i
                  class="iconfont icon-quxiao"
                  @click="
                    removeEdit(scope.row);
                    scope.row.name = scope.row.oldName;
                  "
                ></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.enabled"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="运行优先级" width="120">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i
                class="iconfont icon-xiayi"
                v-if="scope.$index < model.length - 1"
                @click="moveDown(scope.$index)"
                title="下移"
              ></i>
              <i
                class="iconfont icon-shangyi"
                v-if="scope.$index"
                title="上移"
                @click="moveUp(scope.$index)"
                :class="{ icon_style: scope.$index === model.length - 1 }"
              ></i>
              <!-- </el-tooltip> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-xiugai" @click="editRule(scope.row, scope.$index)" title="编辑"></i>
              <i class="iconfont icon-fuzhi" @click="copyRule(scope.row)" title="复制"></i>
              <i class="iconfont icon-shanchu" @click="deleteRule(scope.$index)" title="删除"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="配置规则"
      :append-to-body="appendtobody"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="35%"
    >
      <el-form :model="curItem">
        <el-form-item label="设置修约规则"> </el-form-item>
        <el-form-item>
          <span v-if="curItem.conditions.length === 0">如果</span>
          <el-button v-if="curItem.conditions.length === 0" size="small" icon="icon-el-plus" @click="addConditions"
            >添加条件</el-button
          >
          <el-row type="flex" justify="space-around" v-for="(item, index) in curItem.conditions" :key="index">
            <el-col :span="3">
              <span v-if="index === 0">如果</span>
              <el-select size="mini" v-model="item.connectionType" v-else>
                <el-option label="并且" value="AND"></el-option>
                <el-option label="或者" value="OR"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-select size="mini" v-model="item.comparator">
                <el-option label="结果数据" value="VALUE"></el-option>
                <el-option label="结果数据整数位数" value="INTEGER"></el-option>
                <el-option label="结果数据小数位数" value="DECIMAL"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select size="mini" v-model="item.operator">
                <!-- 'LT', 'LTE', 'GT', 'GTE' -->
                <el-option label=">" value="LT"></el-option>
                <el-option label=">=" value="LTE"></el-option>
                <el-option label="<" value="GT"></el-option>
                <el-option label="<=" value="GTE"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input-number
                style="width:100px"
                size="mini"
                controls-position="right"
                :min="0"
                v-model="item.value"
              ></el-input-number>
            </el-col>
            <el-col :span="3">
              <div class="operation-icon">
                <i class="iconfont icon-jia" @click="addConditions"></i>
                <i class="iconfont icon-jian" @click="removeConditions(index)"></i>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="满足条件" prop="ruleType" :rules="[{ required: true, message: '必选' }]">
          <el-radio-group v-model="curItem.ruleType">
            <el-radio label="DECIMAL_PLACE">仅保留小数位</el-radio>
            <el-radio label="SCIENTIFIC_NOTATION_AND_DP">科学计数法</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div v-show="curItem.ruleType === 'DECIMAL_PLACE'">
            数据保留小数位数=
            <el-input-number
              size="mini"
              v-model="curItem.ordinaryResultDecimalBit"
              controls-position="right"
              :min="0"
            ></el-input-number>

            <p class="example-box">结果数据 = 23.21256 修约数据 = {{ formatFloat(23.21256) }}</p>
          </div>
          <div v-show="curItem.ruleType === 'SCIENTIFIC_NOTATION_AND_DP'">
            整数默认保留到个位 并且 小数位数 =
            <el-input-number
              size="mini"
              v-model="curItem.scientificResultDecimalBit"
              controls-position="right"
              :min="0"
            ></el-input-number>
            <div class="example-box">
              <p>
                结果数据 = 222.2136272 &nbsp; &nbsp; 修约数据 = <span v-html="formatIntegerBitScientific(222.2136272)"></span>
              </p>
              <p>
                结果数据 = 0.002123265 &nbsp; &nbsp; 修约数据 = <span v-html="formatIntegerBitScientific(0.002123265)"></span>
              </p>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <p class="remark" v-show="curItem.ruleType">
        <i class="iconfont icon-wenhaomiaoshu"></i> 备注： 数字修约按照《标准》执行
      </p>
      <span slot="footer">
        <el-button size="small" @click="visible = false">取消</el-button>&nbsp;&nbsp;
        <el-button size="small" type="primary" @click="add()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// revisionRules: [
//           {
//             conditions: [
//               {
//                 comparator: "VALUE",
//                 connectionType: "AND",
//                 operator: "LT",
//                 value: "string"
//               }
//             ],
//             enabled: false,
//             ordinaryResultDecimalBit: 0,
//             ruleType: "DECIMAL_PLACE",
//             scientificResultDecimalBit: 0
//           }
//         ]
export default {
  name: "RevisionL",
  data() {
    return {
      visible: false,
      action: "create",
      curIndex: 0,
      editList: [],
      curItem: {
        conditions: []
      }
    };
  },
  props: {
    model: {
      type: Array,
      default: () => {
        return [];
      }
    },
    appendtobody: { type: Boolean, default: false },
    isShowCreat: { type: Boolean, default: true }
  },
  watch: {
    visible(val) {
      if (!val) {
      }
    },
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isEdit(e) {
      return this.editList.findIndex(item => item === e) === -1 ? false : true;
    },
    addEdit(e) {
      this.editList.push(e);
    },
    removeEdit(e) {
      let index = this.editList.findIndex(item => item === e);
      this.editList.splice(index, 1);
    },
    //格式化整数科学计数法显示
    formatIntegerBitScientific(num) {
      let matchlist = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      const IntegerValue = matchlist[0].slice(0, 1);
      let floatValue;
      if (this.curItem.scientificResultDecimalBit) {
        if (String.prototype.padEnd && this.curItem.scientificResultDecimalBit > matchlist[1].length) {
          matchlist[1] = matchlist[1].padEnd(this.curItem.scientificResultDecimalBit, "0"); // 位数不足则补0
        }
        floatValue = "." + matchlist[1].slice(0, this.curItem.scientificResultDecimalBit);
        const lastNum = matchlist[1].slice(
          this.curItem.scientificResultDecimalBit,
          this.curItem.scientificResultDecimalBit + 1
        );
        if (Number(lastNum) % 2) {
          // 最后一位奇进偶不进
          floatValue = floatValue.substr(0, floatValue.length - 1) + (Number(floatValue[floatValue.length - 1]) + 1);
        }
      } else {
        floatValue = "";
      }
      const powerValue = matchlist[2].replace("+", "");
      return IntegerValue + floatValue + "×" + "10<sup>" + powerValue + "</sup>";
    },
    //格式化小数位数
    formatFloat(num) {
      let matchlist = num.toString().split(".");
      let floatValue;
      if (this.curItem.ordinaryResultDecimalBit) {
        if (String.prototype.padEnd && this.curItem.ordinaryResultDecimalBit > matchlist[1].length) {
          matchlist[1] = matchlist[1].padEnd(this.curItem.ordinaryResultDecimalBit, "0"); // 位数不足则补0
        }
        floatValue = "." + matchlist[1].slice(0, this.curItem.ordinaryResultDecimalBit);
        const lastNum = matchlist[1].slice(this.curItem.ordinaryResultDecimalBit, this.curItem.ordinaryResultDecimalBit + 1);
        if (Number(lastNum) % 2) {
          // 最后一位奇进偶不进
          floatValue = floatValue.substr(0, floatValue.length - 1) + (Number(floatValue[floatValue.length - 1]) + 1);
        }
      } else {
        floatValue = "";
      }
      return matchlist[0] + floatValue;
    },
    addConditions() {
      this.curItem.conditions.push({
        comparator: "VALUE",
        connectionType: "AND",
        operator: "LT",
        value: ""
      });
    },

    removeConditions(index) {
      this.curItem.conditions.splice(index, 1);
    },
    createRule() {
      this.action = "create";
      this.curItem = {
        name: this.model.length + 1,
        enabled: true,
        ruleType: "DECIMAL_PLACE",
        ordinaryResultDecimalBit: 0,
        scientificResultDecimalBit: 0,
        conditions: [],
        isEdit: false
      };
      this.visible = true;
    },
    editRule(item, index) {
      this.action = "edit";
      this.curIndex = index;
      this.curItem = JSON.parse(JSON.stringify(item));
      this.visible = true;
    },
    add() {
      // if(this.curItem.ruleType === 'DECIMAL_PLACE'&&!this.curItem.ordinaryResultDecimalBit){
      //   this.$message.error("条件数值必填")
      //   return
      // }

      // if(this.curItem.ruleType === 'SCIENTIFIC_NOTATION_AND_DP'&&!this.curItem.scientificResultDecimalBit){
      //   this.$message.error("条件数值必填")
      //   return
      // }
      if (this.action === "create") {
        this.model.push(this.curItem);
      } else {
        this.deleteRule(this.curIndex);
        this.model.splice(this.curIndex, 0, this.curItem);
      }
      this.visible = false;
    },
    copyRule(item) {
      const obj = JSON.parse(JSON.stringify(item));
      obj.orderNo = this.model.length + 1;
      obj.name = item.name + "（副本）";
      obj.oldName = item.name + "（副本）";
      this.model.push(obj);
    },
    deleteRule(index) {
      this.model.splice(index, 1);
    },
    //上移
    moveUp(index) {
      let arr = this.model.splice(index, 1);
      this.model.splice(index - 1, 0, arr[0]);
    },
    //下移
    moveDown(index) {
      let arr = this.model.splice(index, 1);
      this.model.splice(index + 1, 0, arr[0]);
    }
  }
};
</script>
<style>
.example-box {
  border: 1px dashed #d5e0ed;
  color: #7692b8;
  width: 390px;
  border-radius: 4px;
  font-size: 12px;
  margin: 10px 0 10px;
  padding: 4px 0 4px 10px;
}

.example-box {
  border: 1px dashed #d5e0ed;
  color: #7692b8;
  width: 390px;
  border-radius: 4px;
  font-size: 12px;
  margin: 10px 0 10px;
  padding: 4px 0 4px 10px;
}
.remark {
  font-size: 12px;
  color: #96a2b3;
}
</style>
