let parsingRule = {
  _model: [
    {
      expressions: [
        {
          expressionType: "COMPONENT",
          identifier: "string",
          leftSide: "string",
          nextExpression: {
            connectionType: "AND",
            identifier: "string"
          },
          operator: "string",
          previousExpression: {
            connectionType: "AND",
            identifier: "string"
          },
          rightSide: "string"
        }
      ],
      identifier: "string",
      nextGroup: {
        connectionType: "AND",
        identifier: "string"
      },
      previousGroup: {
        connectionType: "AND",
        identifier: "string"
      }
    }
  ],
  _objDemo: { fieldId: "value" },
  _rules: null,
  _flag: true,
  _obj: null,
  _totalFlag: null,
  /**
   * 初始化
   * @param {*} rule
   */
  init(rule) {
    this._rules = rule || this._rules;
    this._totalFlag = rule ? [] : this._totalFlag;
    this._flag = true;
    return this;
  },
  _initObj(obj) {
    obj = JSON.stringify(obj);
    this._obj = Object.assign({}, JSON.parse(obj));
  },
  /**
   * 解析 {1232134213:'sdfds'} {fieldId:value}
   * @param {Object} obj
   * @param {*} rule
   */
  parsing(obj, rule = []) {
    this.init(rule);
    this._initObj(obj);
    if (this._rules.length !== 0) {
      this._parsingStart();
    }
    return this;
  },
  /**
   * 解析开始
   */
  _parsingStart() {
    let keys = Object.keys(this._obj);
    keys.map(item => {
      this._parsingField(item);
    });
    this._parsingSystemField();
    this._parsingGroup();
    this._parsingTotal();
  },
  /**
   * 解析全部
   */
  _parsingTotal() {
    this._flag = this._parsingFieldThen(this._rules);
    this._totalFlag.push({
      type: "total",
      id: "root",
      flag: this._flag
    });
  },
  /**
   * 解析系统设置
   */
  _parsingSystemField() {
    this._rules.map(item => {
      item.expressions.map(jtem => {
        if (jtem.expressionType === "USER") {
          this._totalFlag.push({
            id: jtem.id,
            type: "USER",
            flag: jtem.roleImpactResult
          });
        }
      });
    });
  },
  /**
   * 解析组合
   */
  _parsingGroup() {
    this._rules.map(item => {
      this._totalFlag.push({
        id: item.id,
        flag: this._parsingFieldThen(item.expressions),
        type: "group"
      });
    });
  },
  /**
   * 解析字段联合
   */
  _parsingFieldThen(rules = [], flag = false, id = "", i = 0) {
    // let string="";
    // rules.map(item=>{
    //   let  ztem = this._totalFlag.find((jtem) => {
    //     if (jtem.id === item.id) {
    //       return jtem;
    //     }
    //   });
    //   string += (ztem ? ztem.flag : false);
    //   if (item.next.id) {
    //     string += item.next.connectionType=== 'AND'?'&&':'||';
    //   }
    // })
    // console.log(eval(string));
    // return eval(string)
    if (i === rules.length) {
      return flag;
    }
    let rule = null;
    if (id === "") {
      rule = rules[0];
      flag = false;
    } else {
      rule = rules.find(item => {
        if (item.id === id) {
          return item;
        }
      });
    }
    try {
      let flagOne = this._totalFlag.find(item => {
        if (item.id === rule.id) {
          return item;
        }
      });
      let flag2 = flagOne ? flagOne.flag : false;
      flag = flag ? flag && flag2 : flag2;
      //没下一步了
      if (!rule.next.id) {
        return flag;
      }
      //并且
      if (rule.next.connectionType === "AND" && !flag) {
        return false;
      }
      if (rule.next.connectionType === "OR" && flag) {
        return true;
      }
      i++;
      //或者
      return this._parsingFieldThen(rules, flag, rule.next.id, i);
    } catch (err) {
      console.log(this._rules);
      console.log(id);
      console.log(err);
    }
  },
  /**
   * 解析字段
   * @param {*} field
   * @param {*} value
   */
  _parsingField(field) {
    let findRule = [];
    this._rules.map(item => {
      let t = this._findCompentRule(field, item.expressions);
      if (t.length !== 0) {
        findRule = findRule.concat(t);
      }
    });
    if (findRule) {
      findRule.map(item => {
        this._totalFlag.push({
          id: item.id,
          type: "field",
          flag: this._calculationField(item)
        });
      });
    }
  },
  /**
   * 计算字段
   */
  _calculationField(rule) {
    let flag = false;
    switch (rule.operator) {
      case ">=":
        if (parseFloat(this._obj[rule.leftSide]) >= parseFloat(rule.rightSideValue || rule.rightSide)) {
          flag = true;
        }
        break;
      case "=":
        if (this._obj[rule.leftSide] === (rule.rightSideValue || rule.rightSide)) {
          flag = true;
        }
        break;
      case "<=":
        if (parseFloat(this._obj[rule.leftSide]) <= parseFloat(rule.rightSideValue || rule.rightSide)) {
          flag = true;
        }
        break;
      case ">":
        if (parseFloat(this._obj[rule.leftSide]) > parseFloat(rule.rightSideValue || rule.rightSide)) {
          flag = true;
        }
        break;
      case "<":
        if (parseFloat(this._obj[rule.leftSide]) < parseFloat(rule.rightSideValue || rule.rightSide)) {
          flag = true;
        }
        break;
      case "!=":
        if (this._obj[rule.leftSide] !== (rule.rightSideValue || rule.rightSide)) {
          flag = true;
        }
        break;
      case "CONTAINS":
        if (this._obj[rule.leftSide].indexOf(rule.rightSideValue || rule.rightSide) !== -1) {
          flag = true;
        }
        break;
      case "NOT_CONTAINS":
        if (this._obj[rule.leftSide].indexOf(rule.rightSideValue || rule.rightSide) === -1) {
          flag = true;
        }
        break;
      case "IS_EMPTY":
        if (this._obj[rule.leftSide] === "") {
          flag = true;
        }
        break;
      case "IS_NOT_EMPTY":
        if (this._obj[rule.leftSide] !== "") {
          flag = true;
        }
        break;
      default:
        break;
    }
    return flag;
  },
  _findCompentRule(field, rules) {
    let rule = rules.filter(item => {
      if (item.leftSide === field) {
        return item;
      }
    });
    return rule;
  },
  /**
   * 通过id 获取 flag
   * @param {*} id
   */
  getFlagById(id) {
    return this._totalFlag.find(item => {
      if (item.id === id) {
        return item.flag;
      }
    });
  },
  getRootFlag() {
    let item = this._totalFlag.find(item => {
      if (item.type === "total") {
        return item;
      }
    });
    return item;
  },
  getGroupFlag() {
    return this._totalFlag.find(item => {
      if (item.type === "group") {
        return item;
      }
    });
  },
  /**
   * 获取返回值
   */
  getFlag() {
    return this._flag;
  },
  /**
   * 获取规则
   */
  getRule() {
    return this._rule;
  },
  /**
   * 获取全部判断结果
   */
  getTotalFlag() {
    return this._totalFlag;
  },
  /**
   * 返回解析的Obj
   */
  getObj() {
    return this._obj;
  },
  /**
   * 删除所有记录
   */
  removeTotalFlag() {
    this._totalFlag = null;
    return this;
  }
};
window.parsingRule = parsingRule;
export default parsingRule;
