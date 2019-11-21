/* <p>1 +&nbsp;<span style='color: red;' fieldid='test'>test</span></p> */
const symbol = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "⁻", "⁺"]; //上标门
const operator = "×"; // 乘号
let parsingFormula = {
  //规则模型
  _rule: {
    basicsFormula: {
      calcParams: [],
      calculationRuleType: "MAX",
      timeCalcParam: {
        endTime: "",
        increaseTime: "",
        startTime: "",
        timeUnitType: "HOUR"
      }
    },
    componentId: "",
    decimalPlace: 0,
    description: "",
    formulaExpression: "",
    formulaType: "CUSTOMIZE",
    name: "",
    resultOutputControl: "",
    resultRevisionType: "HIGHEST_ACCURACY",
    templateId: "",
    revisionRules: [
      {
        conditions: [
          {
            comparator: "VALUE",
            connectionType: "AND",
            operator: "LT",
            value: ""
          }
        ],
        enabled: false,
        name: "",
        ordinaryResultDecimalBit: 0,
        ruleType: "DECIMAL_PLACE",
        scientificResultDecimalBit: 0
      }
    ],
    triggerConditions: []
  },
  _revisionRules: [], //修约规则
  _calcParams: [], //计算 入参
  _formulaExpression: "", //自定义公式
  _formulaType: "CUSTOMIZE", //计算方式
  _result: 0, //输出
  _obj: { test: 1 }, //数据模型
  init() {
    // this._formulaExpression = this._rule.formulaExpression;
    // this.createTrueExpression();
  },
  /**
   * 初始化 数据模型
   * @param {*} obj
   */
  _initObj(obj) {
    obj = JSON.stringify(obj);
    this._obj = Object.assign({}, JSON.parse(obj));
  },
  /**
   * 初始化 规则模型
   * @param {*} rule
   */
  _initRule(rule) {
    rule = JSON.stringify(rule);
    this._rule = Object.assign({}, JSON.parse(rule));
  },
  /**
   * 解析入口
   * @param {*} obj
   * @param {*} rule
   */
  parsing(obj, rule = {}) {
    this._result = 0;
    this._formulaExpression = "";
    this._calcParams = [];
    this._initObj(obj);
    this._initRule(rule);
    this.startParsing();
    return this;
  },
  /**
   * 开始解析
   */
  startParsing() {
    switch (this._rule.formulaType) {
      case "CUSTOMIZE":
        this.createExpression();
        this.insertValue();
        this.calculation();
        this.formateValue();
        break;
      case "BASIC":
        // try {
        this.createParams();
        // } catch (e) {
        //   console.log(this._calcParams);
        // }
        break;
    }
  },
  /**
   * 创建 basicsFormula 入参
   */
  createParams() {
    switch (this._rule.basicsFormula.calculationRuleType) {
      case "MAX":
        this.addCalcparams();
        this.getMax();
        this.formateValue();
        break;
      case "MIN":
        this.addCalcparams();
        this.getMin();
        this.formateValue();
        break;
      case "AVG":
        this.addCalcparams();
        this.getAvg();
        this.formateValue();
        break;
      case "TIME_ADDITION_SUBTRACTION":
        this.getTimeAdditionSubTraction();
        break;
      case "TIME_DIFFERENCE":
        this.getTimeDifference();
        break;
    }
  },
  /**
   * 提取 入参数据
   */
  addCalcparams() {
    this._rule.basicsFormula.calcParams.map(item => {
      this._calcParams.push(parseFloat(this._obj[item.calcParam]));
    });
  },
  /**
   * 获取时间增减
   */
  getTimeAdditionSubTraction() {
    let timeType = this.checkTime(this._obj[this._rule.basicsFormula.timeCalcParam.startTime]);
    console.log(timeType);
    let startTime = this.getTime(this._obj[this._rule.basicsFormula.timeCalcParam.startTime], timeType);
    let addTime =
      this._rule.basicsFormula.timeCalcParam.timeUnitType === "HOUR"
        ? 60 * 60 * 1000 * this._rule.basicsFormula.timeCalcParam.increaseTime
        : this._rule.basicsFormula.timeCalcParam.timeUnitType === "MINUTE"
        ? 60 * 1000 * this._rule.basicsFormula.timeCalcParam.increaseTime
        : 1000 * this._rule.basicsFormula.timeCalcParam.increaseTime;

    this._result = this.getOutTime(startTime + addTime, timeType);
  },
  /**
   * 获取时间差异
   */
  getTimeDifference() {
    if (
      this._obj[this._rule.basicsFormula.timeCalcParam.startTime].length ===
      this._obj[this._rule.basicsFormula.timeCalcParam.endTime].length
    ) {
      let timeType = this.checkTime(this._obj[this._rule.basicsFormula.timeCalcParam.startTime]);
      let startTime = this.getTime(this._obj[this._rule.basicsFormula.timeCalcParam.startTime], timeType);
      let endTime = this.getTime(this._obj[this._rule.basicsFormula.timeCalcParam.endTime], timeType);
      this._result = this.getOutTimeDValue(endTime - startTime, timeType);
    } else {
      this._result = 0;
    }
  },
  /**
   * 获取输出时间
   * @param {*} str
   * @param {*} timeType
   */
  getOutTimeDValue(str, timeType) {
    let result = 0;
    switch (timeType) {
      case "HHMM":
        result = str / 1000 / 60;
        break;
      case "YYYYMMDDHHMM":
        result = str / 1000 / 60;
        break;
      case "YYYYMMDD":
        result = str / 1000 / 60 / 60 / 24;
        break;
      case "YYYYMM":
        result = str / 1000 / 60 / 60 / 24 / 30;
        break;
      case "YYYY":
        result = str / 1000 / 60 / 60 / 24 / 30 / 12;
        break;
      case "NONE":
        result = str / 1000;
        break;
    }
    return result;
  },
  /**
   * 获取时间  转化用
   * @param {*} str
   * @param {*} timeType
   */
  getTime(str, timeType) {
    let date = new Date();
    let result = 0;
    switch (timeType) {
      case "HHMM":
        str = str.replace(/[时]/g, ":").replace(/[分]/g, "");
        result = new Date(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + str).getTime();
        break;
      case "YYYYMMDDHHMM":
        str = str
          .replace(/[年月]/g, "-")
          .replace(/[日]/g, "")
          .replace(/[时]/g, ":")
          .replace(/[分]/g, "");
        result = new Date(str).getTime();
        break;
      case "YYYYMMDD":
        str = str.replace(/[年月]/g, "-").replace(/[日]/g, "");
        result = new Date(str).getTime();
        break;
      case "YYYYMM":
        str = str.replace(/[年月]/g, "-");
        result = new Date(str + date.getDate()).getTime();
        break;
      case "YYYY":
        str = str.replace(/[年]/g, "-");
        result = new Date(str + (date.getMonth() + 1) + "-" + date.getDate()).getTime();
        break;
      case "NONE":
        result = date.getTime();
        break;
    }
    return result;
  },
  prefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  },
  /**
   * 获取时间
   * @param {*} str
   * @param {*} timeType
   */
  getOutTime(str, timeType) {
    let date = new Date(str);
    let result = 0;
    switch (timeType) {
      case "HHMM":
        result = this.prefixZero(date.getHours(), 2) + "时" + this.prefixZero(date.getMinutes(), 2) + "分";
        break;
      case "YYYYMMDDHHMM":
        result =
          date.getFullYear() +
          "年" +
          (date.getMonth() + 1) +
          "月" +
          date.getDate() +
          "日" +
          " " +
          this.prefixZero(date.getHours(), 2) +
          "时" +
          this.prefixZero(date.getMinutes(), 2) +
          "分";
        break;
      case "YYYYMMDD":
        result = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        break;
      case "YYYYMM":
        result = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
        break;
      case "YYYY":
        result = date.getFullYear() + "年";
        break;
      case "NONE":
        result =
          date.getFullYear() +
          "年" +
          (date.getMonth() + 1) +
          "月" +
          date.getDate() +
          "日" +
          " " +
          this.prefixZero(date.getHours(), 2) +
          ":" +
          this.prefixZero(date.getMinutes(), 2);
        break;
    }
    return result;
  },
  /**
   * 判断时间类型
   * @param {*} str
   */
  checkTime(str) {
    if (/^(\d{2})时(\d{2})分$/.test(str)) {
      return "HHMM";
    } else if (/^(\d{4})年(\d{2})月(\d{2})日\s(\d{2})时(\d{2})分$/.test(str)) {
      return "YYYYMMDDHHMM";
    } else if (/^(\d{4})年(\d{2})月(\d{2})日$/.test(str)) {
      return "YYYYMMDD";
    } else if (/^(\d{4})年(\d{2})月$/.test(str)) {
      return "YYYYMM";
    } else if (/^(\d{4})年$/.test(str)) {
      return "YYYY";
    } else {
      return "NONE";
    }
  },
  /**
   * 获取最大
   */
  getMax() {
    this._calcParams.sort((a, b) => {
      return b - a;
    });
    this._result = this._calcParams[0];
  },
  /**
   * 获取最小
   */
  getMin() {
    this._calcParams.sort();
    this._result = this._calcParams[0];
  },
  /**
   * 获取平均
   */
  getAvg() {
    let length = this._calcParams.length;
    let total = this._calcParams.reduce((a, b) => {
      return a + b;
    });
    this._result = total / length;
  },
  /**
   * 创建 自定义公式
   */
  createExpression() {
    let dom = this.parseDom(this._rule.customFormula.formulaExpression);
    for (let i in dom[0].childNodes) {
      if (dom[0].childNodes[i].nodeName === "SPAN") {
        this._formulaExpression += dom[0].childNodes[i].getAttribute("fieldid");
      } else if (dom[0].childNodes[i].nodeName === "#text") {
        this._formulaExpression += dom[0].childNodes[i].nodeValue.replace(/\s/g, "");
      }
    }
  },
  /**
   * 解析dom
   * @param {*} arg
   */
  parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
  },
  /**
   * 替换 data 入 dom
   */
  insertValue() {
    let list = Object.keys(this._obj);
    list.map(item => {
      this._formulaExpression = this._formulaExpression.replace(item, this._obj[item]);
    });
  },
  /**
   * 计算 结果
   */
  calculation() {
    console.log(this._formulaExpression);
    // eslint-disable-next-line no-eval
    try {
      let result = eval(this._formulaExpression);
      this._result = parseFloat(result);
    } catch (e) {
      console.log(this._rule.formulaExpression);
      this._result = 0;
    }
  },
  /**
   * 修约
   */
  formateValue() {
    this._revisionRules = [];
    if (this._rule.resultRevisionType === "Keep_Decimal_Digits") {
      // this._result = this._result.toFixed(this._rule.decimalPlace);
      this.getEnabledRevision();
      this.execRevision();
    } else {
      let fiexd = this._calcParams
        .map(item => {
          item = item + "";
          return item.split(".")[1] ? (item.split(".")[1] + "").length : 0;
        })
        .sort((a, b) => {
          return b - a;
        })[0];
      try {
        this._result = parseFloat(this._result).toFixed(fiexd);
      } catch (e) {
        console.log(e, this._result);
      }
    }
  },
  /**
   * 获取有效的修约
   */
  getEnabledRevision() {
    this._revisionRules = this._rule.revisionRules.filter(item => item.enabled);
  },
  /**
   * 执行修约
   */
  execRevision() {
    let obj = this._revisionRules.find(item => {
      let flag = false;
      let str = "";
      if (item.conditions.length != 0) {
        item.conditions.map(jtem => {
          str += (jtem.connectionType === "AND" ? "&&" : "||") + this.parsingRevision(jtem);
        });
        str = str.substr(2);
        flag = eval(str);
      }
      if (flag) {
        return item;
      }
    });
    if (!obj) {
      return;
    }
    switch (obj.ruleType) {
      case "DECIMAL_PLACE":
        this._result = this._result.toFixed(obj.ordinaryResultDecimalBit);
        break;
      case "SCIENTIFIC_NOTATION_AND_DP":
        let str = this.num2e(this._result);
        let list = str.split("e");
        this._result =
          parseFloat(list[0]).toFixed(obj.scientificResultDecimalBit) +
          "" +
          (list[1] != "0" ? operator + 10 + this.translateTop(list[1]) : "");
        break;
        // let integerOp = "+";
        // if (this._result < 0) {
        //   integerOp = "-";
        // }
        // let list = integerOp === "-" ? (this._result + "").substr(1).split(".") : (this._result + "").split(".");
        // let integerLength = list[0].length;
        // let decimalLength = list[1].length;
        // let top = integerLength - decimalLength;
        // let str = "";
        // if (integerLength > 1) {
        //   let s1 = list[0].split("");
        //   str = s1[0] + "." + s1.slice(1, s1.length).join("");
        //   top = integerLength - 1;
        //   str += list[1].join("");
        // } else {
        //   if (list[0] === "0") {
        //     let index = list[1].split("").findIndex(a => {
        //       return a != "0";
        //     });
        //     str =
        //       list[1].split("")[index] +
        //       "." +
        //       (list[1].split("").length - 1 != index
        //         ? list[1]
        //             .split("")
        //             .slice(index + 1, list[1].split("").length)
        //             .join("")
        //         : "0");
        //     top = index + 1;
        //   } else {
        //     str = list[0];
        //     str += list[1].join("");
        //     top = 0;
        //   }
        // }
        // str = parseFloat(str).toFixed(obj.scientificResultDecimalBit);
        // str = integerOp === "-" ? "-" + str : str;
        // this._result = str + top != 0 ? operator + 10 + this.translateTop(top) : "";
        //this._result = this._result.toFixed(obj.ordinaryResultDecimalBit);
        break;
    }
  },
  num2e(num) {
    var p = Math.floor(Math.log(num) / Math.LN10);
    var n = num * Math.pow(10, -p);
    return n + "e" + p;
  },
  /**
   * 翻译上标
   * @param {*} top
   */
  translateTop(top) {
    let result = "";
    if (top > 0 && (top + "").length < 2) {
      result = symbol[top];
    } else if (top < 0 && (top + "").length < 3) {
      result = symbol[10] + symbol[-top];
    } else if (top > 0 && (top + "").length > 1) {
      let list = (top + "").split("");
      list.map(item => {
        result += symbol[item];
      });
    } else if (top < 0 && (top + "").length > 2) {
      let list = (top + "").split("");
      result = symbol[10];
      list.slice(1, list.length).map(item => {
        result += symbol[item];
      });
    }
    return result;
  },
  /**
   * 解析规则
   * @param {} item
   */
  parsingRevision(item) {
    let flag = false;
    switch (item.comparator) {
      case "VALUE":
        flag = this.comparaValue(item, this._result);
        break;
      case "INTEGER":
        item.value = Math.pow(10, item.value);
        flag = this.comparaValue(item, this._result);
        break;
      case "DECIMAL":
        item.value = Math.pow(10, -item.value);
        flag = this.comparaValue(item, this._result);
        break;
    }
    return flag;
  },
  /**
   *  比较结果
   * @param {*} item
   * @param {*} value
   */
  comparaValue(item, value) {
    let flag = false;
    switch (item.operator) {
      case "LT":
        if (parseFloat(value) > parseFloat(item.value)) {
          flag = true;
        }
        break;
      case "LTE":
        if (parseFloat(value) >= parseFloat(item.value)) {
          flag = true;
        }
        break;
      case "GT":
        if (parseFloat(value) < parseFloat(item.value)) {
          flag = true;
        }
        break;
      case "GTE":
        if (parseFloat(value) <= parseFloat(item.value)) {
          flag = true;
        }
        break;
    }
    return flag;
  },
  /**
   * 获取结果
   */
  getResult() {
    return this._result === "NaN" ? 0 : this._result;
  }
};
export default parsingFormula;
