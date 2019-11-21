// 录入规则执行算法
import ruleService from '@/service/pc/templateManagement/ruleService.js' // 联动规则接口
import parsingRule from '@/components/tools/parsingRule.js' // 解析显示、值改变规则
import parsingFormula from '@/components/tools/parsingFormula.js' // 解析公式规则
class FormRulesModule {
  constructor() {
    this.originalComponentState = {} // 保存初始的控件的显示或可填状态，便于规则失败时恢复到初始状态
    this.waitApplyRulesControlList = [] // 当前需要执行的规则的控件列表
    this.applyDisplayRuleControlId = null // 当前应用的显示规则的控件fieldId
    this.componentRulesMap = new Map() // 所有规则map
    this.controlRulesMap = new Map() // 每个组件对应的规则id集合
    this.componentData = []
  }
  // 立即执行规则解析
  async implementApplys(fieldId) {
    const rulesList = this.getControlRules(fieldId)
    if (!rulesList.length) return
    let objs = {}
    this.componentData.forEach(item => {
      if (
        item.componentType === 'DATEPICKER' ||
        item.componentType === 'TEXTBOX' ||
        item.componentType === 'COMBOBOX' ||
        item.componentType === 'RADIOBOX'
      ) {
        const value = item.formValue.stringValue
        //去掉首尾空格 ，三目运算防止value为null报错情况
        objs[item.componentAttr.fieldId] = value
          ? value.replace(/$[ ]^/g, '')
          : value
      }
    })
    let dispalyRuleProps = [] //显示规则属性列表
    for (let rule of rulesList) {
      switch (rule.ruleType) {
        case 'PAGE_DISPLAY_RULE': {
          //页面显示规则
          const Flag = parsingRule
            .parsing(objs, rule.pageDisplayRule.groups)
            .getFlag()
          console.log(Flag, rule.pageDisplayRule.name, ' 显示')
          if (Flag) {
            let tempData = rule.pageDisplayRule.ruleConfig.ruleFields.map(
              item => {
                item.Flag = Flag
                item.type = 'PAGE_DISPLAY_RULE'
                return item
              }
            )
            dispalyRuleProps = tempData
          }
          break
        }
        case 'DATA_CHANGE_RULE': {
          if (rule.dataChangeRule.ruleConfigType !== 'Single') {
            //判断是否为单个值触发
            break
          }
          //控件值改变规则
          const Flag = parsingRule
            .parsing(objs, rule.dataChangeRule.triggerConditions)
            .getFlag()
          console.log(Flag, rule.dataChangeRule.name, ' 值改变')
          if (Flag) {
            let tempData = rule.dataChangeRule.ruleConfig.ruleFields.map(
              item => {
                item.type = 'DATA_CHANGE_RULE'
                return item
              }
            )
            console.log(rule.dataChangeRule.ruleConfig.ruleFields)
            this.applyValueRules(tempData)
          }
          break
        }
        case 'DATA_FORMULA_RULE': {
          console.log(rule.dataFormulaRule)
          //公式规则
          const Flag = parsingRule
            .parsing(objs, rule.dataFormulaRule.triggerConditions)
            .getFlag()
          console.log(Flag, rule.dataFormulaRule.name, ' 公式')
          if (Flag) {
            const result = parsingFormula
              .parsing(objs, rule.dataFormulaRule)
              .getResult()
            const tempData = [
              {
                type: 'DATA_CHANGE_RULE',
                value: result,
                id: rule.dataFormulaRule.resultOutputControl
              }
            ]
            this.applyValueRules(tempData)
          }
          break
        }
        case 'DATA_LINKAGE_FORM_RULE': {
          console.log(rule)
          // 数据联动规则
          await this.implementDataLinkRules(rule.dataLinkageChangeRule, rule.id)
          break
        }
      }
    }
    this.applyDisplayRules(dispalyRuleProps, fieldId)
    dispalyRuleProps = []
    this.checkedWaitApplyRules()
  }
  // 获取每个控件对应的规则列表
  getControlRules(fieldId) {
    if (fieldId) {
      let rules = this.controlRulesMap.get(fieldId) || []
      return rules.map(id => this.componentRulesMap.get(id))
    } else {
      return [...this.componentRulesMap.values()] // 没有触发控件则执行所有规则
    }
  }
  // 检查待执行规则队列
  checkedWaitApplyRules() {
    const fieldId = this.waitApplyRulesControlList.shift()
    fieldId && this.implementApplys(fieldId)
  }
  // 检查当前控件值改变是否会触发他的规则
  checkIsHaveRules(curItem, newValue) {
    if (
      curItem.componentAttr.ruleAvailable &&
      JSON.stringify(curItem.formValue.stringValue) !== JSON.stringify(newValue)
    ) {
      this.waitApplyRulesControlList.push(curItem.componentAttr.fieldId) // 将该控件添加至待执行列表
    }
  }
  // 应用值改变规则
  applyValueRules(ruleProp = []) {
    ruleProp.forEach(prop => {
      let curItem = this.componentData.find(
        item => item.componentAttr.fieldId === prop.id
      )
      this.checkIsHaveRules(curItem, prop.value)
      curItem.formValue.stringValue = prop.value + '' // 转为string类型
    })
  }
  // 应用数据联动规则
  applyDataLinkRules(ruleProp) {
    let curItem = this.componentData.find(
      item => item.componentAttr.fieldId === ruleProp.id
    )
    if (!ruleProp.choiceItemsChoiceBox.length) {
      curItem.componentAttr.choiceItemsChoiceBox = JSON.parse(
        JSON.stringify(curItem.componentAttr.choiceItemsChoiceBoxCopy || [])
      )
      curItem.formValue.stringValue = ''
      curItem.formValue.stringListValue = []
      return
    }
    // 存一份原始待选项
    curItem.componentAttr.choiceItemsChoiceBoxCopy = JSON.parse(
      JSON.stringify(curItem.componentAttr.choiceItemsChoiceBox)
    )
    curItem.componentAttr.choiceItemsChoiceBox = ruleProp.choiceItemsChoiceBox // 替换掉待选项
    const chosenItem = ruleProp.choiceItemsChoiceBox.find(d => d.chosen) // 找到默认值
    if (chosenItem) {
      // 如果有默认值则选中
      if (
        ['TEXTBOX', 'COMBOBOX', 'RADIOBOX', 'DATEPICKER'].includes(
          curItem.componentType
        )
      ) {
        this.checkIsHaveRules(curItem, chosenItem.choiceValue)
        curItem.formValue.stringValue = chosenItem.choiceValue
      } else {
        this.checkIsHaveRules(curItem, chosenItem.choiceValue)
        curItem.formValue.stringListValue = [chosenItem.choiceValue]
      }
    } else {
      curItem.formValue.stringValue = ''
      curItem.formValue.stringListValue = []
    }
  }
  // 应用显示规则
  applyDisplayRules(ruleProps, fieldId) {
    if (ruleProps.length) {
      this.componentData = this.componentData.map(item => {
        const obj = ruleProps.find(
          prop => prop.id === item.componentAttr.fieldId
        )
        if (obj) {
          item.componentAttr.fillable = obj.fillable
          item.componentAttr.visible = obj.visible
        }
        return item
      })
      this.applyDisplayRuleControlId = fieldId // 保存当前应用显示规则的控件id
    } else if (fieldId === this.applyDisplayRuleControlId) {
      // 检查是否为上一次的显示规则应用id
      this.componentData = this.componentData.map(item => {
        return this.resetOriginalState(item)
      })
    }
  }
  // 执行数据联动规则
  async implementDataLinkRules(dataLinkageChangeRule, ruleId) {
    let input = {}
    let flag = true
    dataLinkageChangeRule.components.forEach(({ identifier }) => {
      const controlItem = this.componentData.find(
        item => item.componentAttr.fieldId === identifier
      )
      if (!controlItem || !controlItem.formValue.stringValue) {
        // 所有控件都有值才执行规则
        flag = false
      } else {
        input[identifier] = controlItem.formValue.stringValue
      }
    })
    console.log(dataLinkageChangeRule.name, flag)
    if (flag) {
      // 执行规则查询
      await ruleService
        .findDataLinkageChangeRuleResult({ input, ruleId })
        .then(res => {
          const tempData = {
            type: 'DATA_LINKAGE_FORM_RULE',
            choiceItemsChoiceBox: res.data,
            id: dataLinkageChangeRule.componentId
          }
          this.applyDataLinkRules(tempData)
        })
        .catch(er => {
          console.log(dataLinkageChangeRule.name, '执行失败', er)
        })
    }
  }
  //重置控件的显示状态
  resetOriginalState(item) {
    item.componentAttr.fillable = this.originalComponentState[item.id].fillable
    item.componentAttr.visible = this.originalComponentState[item.id].visible
    return item
  }
  // 清除规则数据
  clear() {
    this.componentData = []
    this.controlRulesMap.clear()
    this.componentRulesMap.clear()
  }
  //保存初始的控件状态
  saveOriginalComponentState(componentData) {
    let tempObj = {}
    componentData.forEach(item => {
      tempObj[item.id] = {
        fillable: item.componentAttr.fillable,
        visible: item.componentAttr.visible
      }
    })
    this.originalComponentState = tempObj
    this.componentData = componentData
  }
  // 转换规则为map
  transformRules(rules) {
    this.controlRulesMap.clear()
    this.componentRulesMap.clear()
    const ruleType = {
      PAGE_DISPLAY_RULE: 'pageDisplayRule',
      DATA_CHANGE_RULE: 'dataChangeRule',
      DATA_FORMULA_RULE: 'dataFormulaRule',
      DATA_LINKAGE_FORM_RULE: 'dataLinkageChangeRule'
    }
    rules.forEach(item => {
      this.componentRulesMap.set(item.id, item) // 把规则list转换为id => 规则的map，方便以后取值
      switch (item.ruleType) {
        case 'DATA_FORMULA_RULE': {
          item[ruleType[item.ruleType]].triggerConditions.forEach(gorup => {
            gorup.expressions.forEach(expression => {
              this.addMapRules(expression.leftSide, item.id)
            })
          })
          if (item.dataFormulaRule.formulaType === 'CUSTOMIZE') {
            // 获取自定义公式规则选择的id
            const fieldIds = this.getExecFieldIds(
              item.dataFormulaRule.customFormula.formulaExpression
            )
            fieldIds.forEach(id => {
              this.addMapRules(id, item.id)
            })
          } else {
            // 获取基础公式选择的id
            item.dataFormulaRule.basicsFormula.calcParams.forEach(
              basicsItem => {
                this.addMapRules(basicsItem.calcParam, item.id)
              }
            )
            if (item.dataFormulaRule.basicsFormula.timeCalcParam.startTime) {
              this.addMapRules(
                item.dataFormulaRule.basicsFormula.timeCalcParam.startTime,
                item.id
              )
            }
            if (item.dataFormulaRule.basicsFormula.timeCalcParam.endTime) {
              this.addMapRules(
                item.dataFormulaRule.basicsFormula.timeCalcParam.endTime,
                item.id
              )
            }
          }
          break
        }
        case 'DATA_CHANGE_RULE': {
          item.dataChangeRule.triggerConditions.forEach(gorup => {
            gorup.expressions.forEach(expression => {
              this.addMapRules(expression.leftSide, item.id)
            })
          })
          break
        }
        case 'DATA_LINKAGE_FORM_RULE': {
          item.dataLinkageChangeRule.components.forEach(({ identifier }) => {
            this.addMapRules(identifier, item.id)
          })
          break
        }
        default: {
          item.pageDisplayRule.groups.forEach(gorup => {
            gorup.expressions.forEach(expression => {
              this.addMapRules(expression.leftSide, item.id)
            })
          })
        }
      }
    })
    // 规则去重， 单个控件在一个规则里面可能使用多次
    const rulesMapKeys = [...this.controlRulesMap.keys()]
    rulesMapKeys.forEach(key => {
      let data = this.controlRulesMap.get(key) || [];
      this.controlRulesMap.set(key, [...new Set(data)])
    })
  }
  // 获取fieldId的正则
  getExecFieldIds(str) {
    var reg = /fieldid="(.+?)"/g
    var list = []
    var result = null
    do {
      result = reg.exec(str)
      result && list.push(result[1])
    } while (result)
    return list
  }
  // 添加规则map
  addMapRules(id, ruleId) {
    if (this.controlRulesMap.has(id)) {
      this.controlRulesMap.get(id).push(ruleId)
    } else {
      this.controlRulesMap.set(id, [ruleId])
    }
  }
}
export default FormRulesModule
