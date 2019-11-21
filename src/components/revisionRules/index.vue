<template>
  <div>
    <el-button
      v-if="!isMethod"
      type="primary"
      :size="size"
      :icon="!isHasRule ? 'el-icon-plus' : 'el-icon-edit'"
      :plain="!isHasRule"
      @click="dialogVisible = true"
      >{{ isHasRule ? "修改修约规则" : "添加修约规则" }}</el-button
    >
    <i
      v-else
      class="iconfont"
      :class="!isHasRule ? 'icon-tianjia' : 'icon-bianji'"
      @click="dialogVisible = true"
      >{{ isHasRule ? "修改修约规则" : "添加修约规则" }}</i
    >
    <el-dialog
      title="修约规则"
      :visible.sync="dialogVisible"
      v-el-drag-dialog
      :close-on-click-modal="false"
      append-to-body
      width="30%"
    >
      <div class="rules-box">
        <el-radio-group v-model="rules.ruleType" @change="ruleTypeChange">
          <el-radio label="DECIMAL_PLACE">仅保留小数位</el-radio>
          <el-radio label="SCIENTIFIC_NOTATION_AND_DP">科学计数法输出+保留小数位</el-radio>
          <!-- <el-radio label="NONE">不修约</el-radio> -->
        </el-radio-group>
        <!-- 仅保留小数位 -->
        <ul class="comdition-box" v-show="rules.ruleType === 'SCIENTIFIC_NOTATION_AND_DP'">
          <li>
            <h4>1、条件</h4>
            <div class="comdition-item-box">
              <div>
                <span>结果数据>1时 并且 整数位数 >=</span>
                <el-input-number
                  size="mini"
                  v-model="rules.conditions.integerBit"
                  controls-position="right"
                  :min="0"
                  @blur="handelChange('integerBit')"
                ></el-input-number>
                &nbsp;位
              </div>
              <p class="example-box">示例： 结果数据 >= {{ Math.pow(10, rules.conditions.integerBit - 1) }}</p>
              <span class="or">或者</span>
              <div>
                <span>结果数据&lt;1时 并且 小数位数 >=</span>
                <el-input-number
                  size="mini"
                  v-model="rules.conditions.decimalBit"
                  controls-position="right"
                  :min="0"
                  @blur="handelChange('decimalBit')"
                ></el-input-number>
                &nbsp;位
              </div>
              <p class="example-box">示例： 结果数据 &lt; {{ Math.pow(10, -rules.conditions.decimalBit) }}</p>
            </div>
          </li>
          <!-- 科学计数法输出+保留小数位 -->
          <li>
            <h4>2、满足条件，科学计数法输出：</h4>
            <div class="comdition-item-box">
              <span>整数默认保留到个位 并且 小数位数 =</span>
              <el-input-number
                size="mini"
                v-model="rules.scientificResultDecimalBit"
                controls-position="right"
                :min="0"
                @blur="handelChange('scientificResultDecimalBit')"
              ></el-input-number>
              &nbsp;位
              <div class="example-box">
                示例：
                <p>
                  结果数据 = 222.2136272 &nbsp; &nbsp; 修约数据 = <span v-html="formatIntegerBitScientific(222.2136272)"></span>
                </p>
                <p>
                  结果数据 = 0.002123265 &nbsp; &nbsp; 修约数据 = <span v-html="formatIntegerBitScientific(0.002123265)"></span>
                </p>
              </div>
            </div>
          </li>
          <li>
            <h4>3、不满足条件，保留小数输出：</h4>
            <div class="comdition-item-box">
              <span>数据保留小数位数 =</span>
              <el-input-number
                size="mini"
                v-model="rules.ordinaryResultDecimalBit"
                controls-position="right"
                :min="0"
                @blur="handelChange('ordinaryResultDecimalBit')"
              ></el-input-number>
              &nbsp;位
              <p class="example-box">结果数据 = 23.21256 修约数据 = {{ formatFloat(23.21256) }}</p>
            </div>
          </li>
        </ul>
        <div class="decimalbit-box" v-show="rules.ruleType === 'DECIMAL_PLACE'">
          <span>数据保留小数位数&nbsp;&nbsp;&nbsp;</span>
          <el-input-number
            size="mini"
            v-model="rules.ordinaryResultDecimalBit"
            controls-position="right"
            :min="0"
            @blur="handelChange('ordinaryResultDecimalBit')"
          ></el-input-number>
          &nbsp;位
          <p class="example-box">示例：结果数据 = 23.21256 &nbsp; &nbsp; 修约数据 = {{ formatFloat(23.21256) }}</p>
        </div>
        <p class="remark" v-show="rules.ruleType !== 'NONE'">
          <i class="iconfont icon-wenhaomiaoshu"></i> 备注： 数字修约按照《标准》执行
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="submit" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "revisionRules",
  data() {
    return {
      action: "create",
      revisionId: "",
      dialogVisible: false,
      rules: {
        ruleType: "DECIMAL_PLACE",
        conditions: {
          integerBit: 2, // 整数位
          decimalBit: 2 // 小数位
        },
        scientificResultDecimalBit: 2, //科学计数法保留小数位数
        ordinaryResultDecimalBit: 2 // 不满徐条件保留小数位数
      }
    };
  },
  props: {
    isMethod: { type: Boolean, default: false },
    methodId: { type: String, default: "" },
    value: {
      // 修约规则对象
    },
    size: {
      // 按钮尺寸
      default: "mini",
      type: String
    }
    // btnTilte:{  // 按钮文案
    //   default:'添加修约规则',
    //   type:String,
    // },
  },
  created() {
    if (this.value && !this.isMethod) {
      this.rules = JSON.parse(JSON.stringify(this.value));
    } else {
      this.getMethodRevision();
    }
  },
  computed: {
    isHasRule() {
      return this.value && this.value.ruleType !== "NONE";
    }
  },
  watch: {
    dialogVisible(val) {
      if (val&&!this.isMethod) {
        this.rules = JSON.parse(JSON.stringify(this.value));
        if (this.rules.ruleType === "NONE") {
          this.rules.ruleType = "DECIMAL_PLACE";
        }
      }
    }
  },
  methods: {
    getMethodRevision() {
      this.$http.evaluateService.getMethodRevision(this.methodId).then(res => {
        if (res.data) {
          this.action = "update";
          this.revisionId = res.data.id;
          this.rules = res.data;
        }
      });
    },
    ruleTypeChange(val) {
      Object.assign(this.rules, {
        ruleType: val,
        conditions: {
          integerBit: 2, // 整数位
          decimalBit: 2 // 小数位
        },
        scientificResultDecimalBit: 2, //科学计数法保留小数位数
        ordinaryResultDecimalBit: 2 // 不满徐条件保留小数位数
      });
    },
    submit() {
      if (!this.isMethod) {
        this.$emit("input", JSON.parse(JSON.stringify(this.rules))); //回调给v-model 改变值
        this.$emit("getValue", JSON.parse(JSON.stringify(this.rules))); //添加一个回调事件
      } else {
        this.action === "create" ? this.createMethod() : this.updateMethod();
      }
      this.closeDialog();
    },
    createMethod() {
      this.$http.evaluateService.createMethodRevision(Object.assign(this.rules, { methodDataId: this.methodId })).then(()=>{
        this.$emit("getValue");
      });
    },
    updateMethod() {
      this.$http.evaluateService
        .updateMethodRevision(this.revisionId, Object.assign(this.rules, { methodDataId: this.methodId }))
        .then(()=>{
        this.$emit("getValue");
      });
    },
    handelChange(type) {
      this.$nextTick(() => {
        switch (type) {
          case "integerBit":
            this.rules.conditions.integerBit = parseInt(this.rules.conditions.integerBit);
            break;
          case "decimalBit":
            this.rules.conditions.decimalBit = parseInt(this.rules.conditions.decimalBit);
            break;
          case "scientificResultDecimalBit":
            this.rules.scientificResultDecimalBit = parseInt(this.rules.scientificResultDecimalBit);
            break;
          case "ordinaryResultDecimalBit":
            this.rules.ordinaryResultDecimalBit = parseInt(this.rules.ordinaryResultDecimalBit);
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    //格式化整数科学计数法显示
    formatIntegerBitScientific(num) {
      let matchlist = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      const IntegerValue = matchlist[0].slice(0, 1);
      let floatValue;
      if (this.rules.scientificResultDecimalBit) {
        if (String.prototype.padEnd && this.rules.scientificResultDecimalBit > matchlist[1].length) {
          matchlist[1] = matchlist[1].padEnd(this.rules.scientificResultDecimalBit, "0"); // 位数不足则补0
        }
        floatValue = "." + matchlist[1].slice(0, this.rules.scientificResultDecimalBit);
        const lastNum = matchlist[1].slice(this.rules.scientificResultDecimalBit, this.rules.scientificResultDecimalBit + 1);
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
      if (this.rules.ordinaryResultDecimalBit) {
        if (String.prototype.padEnd && this.rules.ordinaryResultDecimalBit > matchlist[1].length) {
          matchlist[1] = matchlist[1].padEnd(this.rules.ordinaryResultDecimalBit, "0"); // 位数不足则补0
        }
        floatValue = "." + matchlist[1].slice(0, this.rules.ordinaryResultDecimalBit);
        const lastNum = matchlist[1].slice(this.rules.ordinaryResultDecimalBit, this.rules.ordinaryResultDecimalBit + 1);
        if (Number(lastNum) % 2) {
          // 最后一位奇进偶不进
          floatValue = floatValue.substr(0, floatValue.length - 1) + (Number(floatValue[floatValue.length - 1]) + 1);
        }
      } else {
        floatValue = "";
      }
      return matchlist[0] + floatValue;
    }
  }
};
</script>

<style scoped>
.rules-box {
  position: relative;
  margin-top: 5px;
  min-height: 200px;
  padding-bottom: 10px;
}
.comdition-box li {
  margin-top: 10px;
  margin-bottom: 8px;
}
.comdition-item-box {
  margin-left: 23px;
  margin-top: 5px;
  color: #344152;
}
.decimalbit-box {
  margin-top: 20px;
  color: #344152;
}
.remark {
  font-size: 12px;
  position: absolute;
  bottom: -10px;
  color: #96a2b3;
}
.or {
  background: #f0f4fa;
  padding: 3px 4px;
  color: #606266;
  border-radius: 3px;
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
</style>
