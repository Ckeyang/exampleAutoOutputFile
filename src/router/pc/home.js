import index from './index.js';
import statuteBank from './statuteBank/statuteBank.js';
import standardBank from './standardBank/standardBank.js';
import notice from './standardBank/notice.js';
import projectManagement from './projectManagement/projectManagement.js';
import userManagement from './userManagement/userManagement.js';
import materialManagement from './materialManagement/material.js';
// import templateManagment from './templateManagement/templateManagement.js';
import labelBankManagment from './labelBank/labelBank.js';
import basisBankManagement from './basisBankManagement/basisBank.js';
import evaluateManagement from './evaluateBankManagement/evaluateBank.js';
import reportManagement from './reportManagement/reportManagement.js';
import parameterManagement from './systemManagement/system.js';
import commonDatabaseManagement from './commonDatabaseManagement/commonDatabase.js';
export default {
  path: '/',
  name: 'home',
  component: (resolve) => require(['@/views/common/Home.vue'], resolve),
  // meta: { title: "系统首页" },
  children: [
    index,
    statuteBank,
    standardBank,
    basisBankManagement,
    materialManagement,
    parameterManagement,
    notice,
    projectManagement,
    userManagement,
    commonDatabaseManagement,
    labelBankManagment,
    reportManagement,
    evaluateManagement
  ]
};
