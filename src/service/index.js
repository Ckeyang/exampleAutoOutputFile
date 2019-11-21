import statute from './pc/statute/index.js'
import standardService from './pc/standardBack/standard.js'
import noticeService from './pc/standardBack/notice.js'
import projectService from './pc/projectManagement/project.js'
import templateService from './pc/projectManagement/template.js'
import formEnterService from './pc/projectManagement/formEnter.js'
import projectTemplateService from './pc/projectManagement/projectTemplate.js'
import jurisdictionService from './pc/userManagement/jurisdiction.js'
import userService from './pc/userManagement/user.js'
import loginService from './pc/login/login.js'
import materialService from './pc/materialManagement/material.js'
import templateListService from './pc/templateManagement/templateList.js'
import labelBankService from './pc/labelBankManagement/labelBank.js'
import basisBankService from './pc/basisBankManagement/basisBank.js'
import reportService from './pc/reportManagement/reportService.js'
import evaluateService from './pc/evaluateManagement/evaluate.js'
import fileService from './pc/fileUpload/fileUpload.js'
import sharedPartsService from './pc/sharedParts/sharedParts.js'
import sharedPartsRulesService from './pc/sharedParts/sharedPartsRules.js'
import customNumberService from './pc/userManagement/customNumber.js'
import ruleService from './pc/templateManagement/ruleService.js'
import staticMaterialService from './pc/materialManagement/staticMaterial.js'
import takeExampleService from './pc/systemManagement/takeExample.js'
import formulaService from './pc/systemManagement/formula.js'
import systemParamsService from './pc/systemManagement/systemParams.js'
import paramterService from './pc/parameter/parameter.js'
import deviceService from './pc/deviceManagement/device.js'
import advisoryCategoryService from './pc/advisoryCategory/advisoryCategory.js'
import laboratorySamplingService from './pc/projectManagement/laboratorySampling.js'
import orderService from './pc/userManagement/order.js'
import indexService from './pc/index.js'
import commonDatabaseService from './pc/commonDatabase/commonDatabase'
import websocketService from './pc/webSocket/index'
export default {
  commonDatabaseService, //公共数据
  fileService, //图片上传，文件上传
  loginService, //登陆
  statute, // 法规库api
  standardService, // 标准库api
  noticeService, //公告服务
  projectService, //项目服务
  templateService, //组件表单
  formEnterService, //表单录入和预览
  jurisdictionService, //权限
  userService, //用户
  materialService, //物质
  labelBankService, //标签
  basisBankService, //依据
  evaluateService, //评价方法
  reportService, //报告方法
  sharedPartsService, //共享件方法
  sharedPartsRulesService, //共享件规则设置
  templateListService, //模板管理
  customNumberService, //自定义编号
  ruleService, //规则
  staticMaterialService, //新版物质
  takeExampleService, //采样方法
  paramterService, //参数列表以及限值规定
  advisoryCategoryService, //咨询列表
  formulaService, //公式
  deviceService, //设备管理
  laboratorySamplingService, //实验室采样
  orderService, // 订单
  projectTemplateService, // 项目模板管理
  systemParamsService, // 系统参数
  indexService, // 首页
  websocketService
}
