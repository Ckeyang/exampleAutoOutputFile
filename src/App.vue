<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view />
  </div>
</template>
<script>
import { mathJaxConfig } from '../static/js/MathJax.js' //  MathJax样式配置
import { throttle } from '@/utils'
export default {
  name: 'App',
  created() {
    let that = this
    window.addEventListener(
      'resize',
      throttle(function() {
        let winHeight
        if (window.innerHeight) {
          winHeight = window.innerHeight
        } else if (document.body && document.body.clientHeight) {
          winHeight = document.body.clientHeight
        }
        console.log(winHeight)
        that.$store.commit({ type: 'setwinHeight', val: winHeight })
      }, 300)
    )
  },
  mounted() {
    mathJaxConfig()
    let winHeight
    if (window.innerHeight) {
      winHeight = window.innerHeight
    } else if (document.body && document.body.clientHeight) {
      winHeight = document.body.clientHeight
    }
    this.$store.commit({ type: 'setwinHeight', val: winHeight })
  }
}
</script>
<style lang="scss">
@import 'vxe-table/styles/variable.scss';
@import './plugins/vxe-table/custom.scss'; // 自定义修改vxe-table样式
@import 'vxe-table/styles/default.scss';
@import '../static/css//themes/index.scss';
@import '../static/font/iconfont.css'; /*iconfont字体图标*/
@import '../static/css/main.css';
@import './assets/css/common.css';
/* @import '../static/css/theme-green/color-green.css'; 浅绿色主题 */
/* @import '../static/css/theme-green/index.css'; */
/*改变element-ui组件的样式，前面是自定义类名，后面为组件类名*/
/*录入法规页*/

.icon-i-dingdanxinxi {
  color: rgba(191, 191, 191, 1) !important;
  font-weight: normal !important;
}
.icon-i-dingdanxinxi:hover {
  color: rgba(24, 132, 204, 1) !important;
}
.el-table .disabledClass {
  background-color: #f7f7f7 !important;
}
.el-table .successClass {
  background-color: #e6f9ff !important;
}
.el-table .errorClass {
  background-color: #ffeee5 !important;
}
.el-table .isDivision {
  background: linear-gradient(
    #ffffff,
    #ffffff,
    #ffffff,
    #ffffff,
    #ffffff,
    #ffffff,
    #1884cc
  ) !important;
  border-bottom-color: red;
}
.small-switch .el-switch__core {
  width: 31px !important;
  height: 16px;
}
.small-switch .el-switch__core:after {
  top: 0;
  left: 0;
  height: 14px;
  width: 14px;
}
.small-switch.el-switch.is-checked .el-switch__core::after {
  margin-left: -14px !important;
}
.el-dialog__body .el-form-item {
  margin-bottom: 8px;
}
.login-box .el-carousel__indicator.is-active button {
  background: rgba(39, 189, 255, 1);
}
.login-box .el-checkbox__label {
  font-size: 12px;
}
.login-item .el-input__icon {
  width: 40px;
}
.login-right input::-webkit-input-placeholder {
  font-size: 13px;
  color: #9badcc;
}
.login-right .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0ba0e0;
}
.login-right .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #0ba0e0;
  border-color: #0ba0e0;
}
.el-submenu__title i {
  margin-right: 7px;
  font-size: 14px;
}
body,
button,
input {
  font-family: 'Helvetica Neue', Helvetica, Tahoma, Arial, 'Microsoft Yahei',
    'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif;
}
.el-textarea__inner {
  font-size: 13px !important;
  font-family: '\5FAE\8F6F\96C5\9ED1';
}
li,
ul {
  list-style: none;
}
.upload-custom .el-upload {
  border: none;
  background: transparent;
  width: auto;
  height: auto;
  overflow: inherit;
}
.areaLabel .el-form-item__label {
  margin-right: 25px;
}
/*法规展示页*/
.search-box .el-form-item {
  margin-bottom: 0;
}
.search-box .el-input__inner {
  height: 36px;
  line-height: 36px;
}
.el-input__suffix .icon-i-saoma {
  font-size: 12px;
  display: inline-block;
}
.pages .el-input--small .el-input__inner {
  height: 28px;
  line-height: 29px;
  width: 110px;
  margin-top: 2px;
}
.page-jump .el-input__inner {
  width: 55px;
  height: 28px;
  text-align: center;
}
.regulation-tb table {
  font-size: 12px;
}
.el-pager li {
  font-weight: normal !important;
}
.file-popover {
  padding: 12px 0 !important;
}
.el-table .el-table__header th,
.cus-header-class {
  background-color: #f5f8fa !important;
  font-weight: bold;
  color: #262626;
}
.vxe-table {
  top: -1px;
}
// .regulation-tb .el-table tr:hover td {
//   font-weight: bold;
// }
.hover-row > td:first-child::before,
.regulation-tb .el-table__row.hover-row > td::before,
.regulation-tb .el-table__row:hover td:first-child::before,
.regulation-tb .el-table .el-table__row.checked-row td::before {
  opacity: 1 !important;
}
.el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: transparent;
}
.regulation-tb .el-table__row td:first-child::before {
  position: absolute;
  top: -1px;
  bottom: 0;
  left: 0px;
  width: 2px !important;
  display: block;
  opacity: 0;
  content: '';
  transition: none;
  background: #107ac2;
}
.vxe-table .body--wrapper .vxe-body--row td {
  position: relative;
}
.vxe-table .body--wrapper .row--hover > td:first-child::before {
  position: absolute;
  top: -1px;
  bottom: 0;
  left: 0px;
  width: 2px !important;
  display: block;
  content: '';
  transition: none;
  background: #107ac2;
}
.regulation-tb .el-table .el-table__row.checked-row {
  background: #e6f9ff;
}
.regulation-tb .el-table .el-table__row.disabled-row {
  background: #f7f7f7;
  color: #a6a6a6;
}
.el-table .el-table__row.disabled-row .operation-icon i {
  color: #3c4652;
}
.el-table .el-table__row.drlft-row {
  background: #fff7f7;
}
.el-table--enable-row-transition .el-table__body td {
  -webkit-transition: background-color 0s;
  transition: background-color 0s;
}
.el-table tr:hover {
  // 避免取消勾选后选框td出现背景
  background: #fff;
}
//表格行hover背景
.el-table--enable-row-hover .el-table__body tr:hover > td,
.el-table__body .el-table__row.hover-row > td,
.vxe-table--body .row--hover > td {
  background: #e6f9ff;
}
.vxe-table .vxe-body--row.drlft-row {
  background-color: #fff0f0 !important;
}
.vxe-table .vxe-body--row.disabled-row {
  background-color: #f7f7f7 !important;
  color: #a6a6a6;
}
.vxe-table .vxe-body--row.disabled-row .operation-icon i {
  color: #3c4652;
}
.vxe-table .vxe-body--row.checked-row {
  background: #e6f9ff !important;
}
.vxe-table .vxe-body--row.row--hover {
  background-color: #e6f9ff;
}
.vxe-checkbox.is--indeterminate
  > input:not(:checked)
  + .vxe-checkbox--icon:before {
  left: 0;
}
.regulation-tb .el-table__fixed-right,
.regulation-tb .el-table__fixed {
  bottom: 11px !important;
  // box-shadow: 0 0 1px #e8e8e8;
}
.regulation-tb .el-table__fixed-right::before,
.regulation-tb .el-table__fixed::before {
  background: transparent;
}
.regulation-tb .el-table__fixed-body-wrapper {
  max-height: calc(100% - 49px) !important;
}
//表头动态显示选择框
.checkbox-box {
  line-height: 25px;
}
.table.popover-box {
  height: 280px;
  overflow: auto;
}
.cus-fillable-checkbox,
.cus-visible-checkbox {
  color: #909399;
  font-weight: bold;
}
.checkbox-box .cus-el-checkbox {
  margin-left: 0;
  display: block;
}
// .row-is-checked td {
//   background: #ecf5ff;
// }
// .row-is-checked td:first-child::before {
//   opacity: 1;
//   left: 0;
// }
// .row-check-begin td:first-child::before {
//   border-top-left-radius: 4px;
// }
// .row-check-end td:first-child::before {
//   border-bottom-left-radius: 4px;
// }
// .entryForms .el-table--enable-row-transition .el-table__body td {
//   transition: background-color 0s linear;
// }
/*词条页*/
.font-bold label.el-form-item__label {
  font-weight: bold;
}
.el-tooltip__popper.is-light {
  border-color: #dee0e6 !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 720px;
  line-height: 23px;
  font-family: '微软雅黑';
}
.el-menu--popup-right-start .el-menu-item {
  font-size: 13px;
}
.el-menu--popup {
  min-width: auto;
}
.el-tooltip__popper.is-light .tb-box {
  max-height: 300px;
  overflow: auto;
}
.el-tooltip__popper.is-light[x-placement^='top'] .popper__arrow {
  border-top-color: #dee0e6 !important;
  // left: 26px !important;
}
.el-tooltip__popper.is-light[x-placement^='bottom'] .popper__arrow {
  border-bottom-color: #dee0e6 !important;
  left: 26px !important;
}
.el-tooltip__popper.is-light[x-placement^='right'] .popper__arrow {
  border-right-color: #dee0e6 !important;
}
/*dialog样式*/
.el-dialog__header .el-dialog__title {
  font-size: 15px;
  font-weight: bold;
  color: #1e2329;
}
.el-dialog__header {
  padding: 15px 20px;
}
.el-dialog__headerbtn {
  top: 16px;
}
.el-dialog .el-dialog__body {
  padding: 8px 24px 20px;
  border-top: 1px solid #e6ecf5;
  border-bottom: 1px solid #e6ecf5;
}
.el-dialog .el-dialog__footer {
  padding: 15px 24px 15px;
}
.el-dialog .el-form-item__label {
  color: #1f2329;
}
.el-dialog .el-form--label-top .el-form-item__label {
  display: inline-block;
  height: 34px;
  line-height: 50px;
}
.el-dialog__headerbtn .el-dialog__close {
  transition: all 0.3s;
  font-weight: bold;
}
.el-dialog__headerbtn:focus .el-dialog__close,
.el-dialog__headerbtn:hover .el-dialog__close {
  transform: rotate(90deg);
}
.el-dialog {
  border-radius: 5px;
  font-family: '微软雅黑';
  min-width: 500px !important;
  // top: 50% !important;
  // margin-top: 0 !important;
  // transform: translateY(-58%);
}
.el-message-box__wrapper {
  top: -25%;
}
.el-message {
  min-width: 200px;
}
.el-message.is-closable .el-message__content {
  padding-right: 30px;
}
.el-cascader {
  width: 100%;
}
.tableHeadChoicePopper {
  padding: 0 0 10px 0;
}
.operation-icon .el-dropdown-menu__item {
  font-size: 12px;
}
.dialog-box .el-input--suffix .el-input__inner {
  height: 32px;
}
.el-form-item.is-required .el-form-item__label:before {
  position: relative;
  top: 2px;
}
.el-checkbox-group .el-checkbox {
  display: block;
  margin: 10px 0;
}
.city-box .el-input__inner {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-select-dropdown.el-popper {
  max-width: 600px;
}
.redColor label.el-form-item__label {
  color: red;
}
.el-menu-item.is-active {
  background: rgb(67, 74, 80) !important;
  border-left: 3px solid;
}
.el-menu-item i {
  font-size: 14px;
  margin-right: 7px;
}
.chech-box {
  margin-top: 5px !important;
}
.el-tooltip img {
  width: 300px !important;
  height: 50px !important;
}
.el-tooltip table td {
  padding: 0;
  margin: 0;
}
.el-tooltip table.demo {
  height: 45px;
  display: inline-block;
  border-collapse: collapse;
  border: none;
}
.el-tooltip__popper table.demo {
  border-collapse: collapse;
}
// .cell {
//   max-height: 48px;
// }
.block-checkbox .el-checkbox {
  margin-left: 0;
  line-height: 30px;
}
.attrShow .el-form-item__content {
  line-height: 34px;
}
.el-dialog__body {
  max-height: 63vh;
  overflow: auto;
}
.groupTemBox .flexBox .el-select,
.groupTemBox .flexBox .el-input {
  margin-right: 5px;
}
// 隐藏弹框
.hideDialog {
  display: none;
}
/*
======================模板库================================================================

*/
.com-input-box .el-form-item__label {
  padding-bottom: 0 !important;
  font-size: 14px;
}
.right .el-form-item {
  margin: 10px 0;
}
/* .right .el-dialog__body {
	padding: 0;
} */
.custonComponents-list .el-dropdown {
  position: absolute;
  right: 1px;
  top: -4px;
  transform: rotate(90deg) translate(-3px, -5px);
}
.custonComponents-list .el-dropdown-link {
  width: 30px;
  height: 30px;
  display: inline-block;
}
.custonComponents-list .el-dropdown:hover {
  color: #26beff;
}
.up-tip {
  position: relative;
  top: -64px;
  left: 70px;
}
.entryDialog .el-dialog {
  position: relative;
  margin-top: 10vh !important;
}
.entryDialog .el-dialog__body {
  max-height: 67vh;
  overflow: auto;
  padding-left: 32px;
}
.activeColor .el-form-item__content {
  border: 1px solid red;
  border-radius: 4px;
}
.activeColor .el-form-item__content input,
.activeColor .el-form-item__content textarea {
  border: none;
}
.q_content .el-form-item__label {
  font-weight: bold;
}
.upload-preview_box .el-upload--picture-card {
  height: 176px;
}
.upload-preview_box .el-upload--picture-card {
  line-height: 30px;
}
// .preview-box .el-dialog__body {
//   height: 500px;
//   overflow: hidden;
// }
.preview-box .el-carousel__container {
  // height: 500px !important;
  text-align: center;
}
// .preview-box .el-carousel__container img {
//   position: absolute;
//   top: 50%;
//   max-width: 100%;
//   max-height: 1005;
//   transform: translate(-50%, -50%);
// }
.tips-box {
  margin-bottom: 15px;
  position: relative;
  width: 400px;
}
.tips-box > div {
  cursor: pointer;
}
.audit-box .el-popover {
  width: 400px;
}
.redColor .el-form-item__label,
.redColor .index-sort {
  color: #ec3e3e !important;
}

.fileUpload .el-upload-list {
  margin-top: -45px;
}
.com-input-box .el-checkbox-group .el-checkbox {
  margin-left: 0 !important;
}
.radio-box .el-radio {
  line-height: 20px;
  margin-left: 0;
  margin-top: 10px;
}
.el-select-dropdown__list {
  padding-bottom: 20px !important;
}
.el-tooltip.focusing {
  outline: none;
}
.el-form--label-top .el-form-item__label {
  /* line-height:0; */
  padding: 0;
}
.right .el-form--label-top .el-form-item__label {
  line-height: 26px;
}
.el-form--label-top .el-textarea {
  margin-top: 6px;
}
.el-upload--text {
  border: none;
}
.el-popover .el-popover__title {
  font-size: 15px;
}
.el-message--info,
.el-message--success {
  min-width: 250px;
}
.copy-tips-message {
  width: 130px;
}
.el-tag + .el-tag {
  margin-left: 3px;
}
// 按钮loading动画
.icon-i-shengchengzhong {
  color: #1884cc;
}
.icon-i-shengchengzhong::before {
  animation: rotate 2s linear infinite;
  display: inline-block;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/*
-----------------------滚动条样式--------------------------
*/
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.template-left {
  background: #fff;
  border-right: 1px solid #dde5ed;
}
.sidebar .el-scrollbar__thumb {
  background-color: #adadad;
}
.el-scrollbar__bar {
  right: 1px;
}
// .el-scrollbar__wrap{
//   margin-left:-9px;
// }
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/

.el-scrollbar__thumb {
  background-color: #adadad;
}
.middle-box .middle::-webkit-scrollbar-track {
  background: none;
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #999;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background: #adadad;
  cursor: pointer;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  border: none;
  background: #fafafa;
  cursor: pointer;
}
// 下拉盒子的滚动宽度 公共样式
.scrollbar-common-style::-webkit-scrollbar {
  width: 7px;
}
</style>
