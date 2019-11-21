<template>
  <div class="header">
    <div class="logo-box">
      <!-- 折叠按钮 -->
      <el-tooltip class="item" effect="dark" :content="collapse ? '展开导航' : '收缩导航'" placement="bottom">
        <div class="nav-sousu" @click="collapseChage">
          <i class="iconfont icon-i1"></i>
        </div>
      </el-tooltip>
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" class="logo-img" />
        <span class="logo-title">报告生成系统</span>
      </div>
    </div>
    <!-- <el-dropdown class="user-name" trigger="click" @command="toggleThemes">
          <span>
            {{this.name}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="theme-default">蓝色</el-dropdown-item>
            <el-dropdown-item command="theme-red">红色</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <!-- <div class="user-avator">
          <img src="static/img/img.jpg">
        </div> -->
        <!-- 任务池 -->
        <task-pool />
        <span style="color:#454545;font-size:14px;" v-if="user.trialInfo"
          >试用剩余：<span style="color:#F63E3E">{{ getEndDay() }} 天</span></span
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <i class="iconfont icon-goumaizhongxin" @click="$router.push('/pay/pricePage')">购买中心</i>
        <message-logs class="message-logs" iconColor="#575959" />
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name-box" trigger="click" @command="handleCommand">
          <span>
            <span class="user-name">{{ this.name }}</span>
            <i class="iconfont icon-i-gerentouxiang user-avator"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form :model="updatePass" :rules="rules" ref="updatePass">
        <el-form-item label="旧密码" prop="oldPassword" class="oldPassword-box">
          <el-input type="password" v-model="updatePass.oldPassword" size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="updatePass.newPassword" size="small" />
        </el-form-item>
        <el-form-item label="确认密码" prop="comfirePassword">
          <el-input type="password" v-model="updatePass.comfirePassword" size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="doUpdatePassword" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Bus from "../common/bus";
import messageLogs from "@/components/messageLogs/index.vue";
import taskPool from "@/components/messageLogs/taskPool.vue";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.updatePass.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      updatePass: {
        newPassword: "",
        oldPassword: "",
        comfirePassword: ""
      },
      rules: {
        newPassword: [{ required: true, message: "请输入新密码" }],
        oldPassword: [{ required: true, message: "请输入旧密码" }],
        comfirePassword: [{ required: true, validator: validatePass2, trigger: "blur" }]
      },
      dialogVisible: false,
      collapse: false, //是否折叠
      name: "",
      user: {},
      message: "" //未读消息
    };
  },
  components: { messageLogs, taskPool },
  created() {
    this.name = sessionStorage.userName || "";
    this.user = JSON.parse(sessionStorage.userInfo);
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.resetForm();
        this.$nextTick(() => {
          document.querySelector(".oldPassword-box .el-input__inner").focus();
        });
      }
    }
  },
  methods: {
    // toggleThemes(val){
    //   document.getElementById('app').className = val
    // },
    doUpdatePassword() {
      this.$refs["updatePass"].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          this.$http.userService.updatePassword(this.updatePass).then(res => {
            this.logOut();
          });
        }
      });
    },
    getEndDay() {
      return Math.floor((new Date(this.user.trialInfo.trialEndTime).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24);
    },
    resetForm() {
      this.$refs["updatePass"].resetFields();
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      switch (command) {
        case "loginout":
          this.logOut();
          break;
        case "updatePassword":
          this.dialogVisible = true;
          this.updatePass = {
            newPassword: "",
            oldPassword: "",
            comfirePassword: ""
          };
          break;
      }
    },
    logOut() {
      try {
        window.postMessage("loginout");
      } catch (e) {
        Bus.$emit("loginout");
      }
      this.$http.loginService
        .logout()
        .then(() => {
          delete sessionStorage.userInfo;
          delete sessionStorage.userName;
          delete sessionStorage.userId;
          delete sessionStorage.token;
          this.$router.push("/login");
        })
        .catch(() => {
          delete sessionStorage.userInfo;
          delete sessionStorage.userName;
          delete sessionStorage.userId;
          delete sessionStorage.token;
          this.$router.push("/login");
        });
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      Bus.$emit("collapse", this.collapse);
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  color: #f0f3f5;
}
.nav-sousu {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  color: #344152;
  transition: 0.3s;
}
.nav-sousu:hover {
  background: #1884cc;
  color: #fff;
}
.nav-sousu.active {
  background: #1884cc;
  color: #fff;
}
.header .logo-box {
  float: left;
  width: 240px;
  font-weight: bold;
  display: flex;
  height: 60px;
  justify-content: flex-start;
  align-items: center;
}
.header .logo-box .logo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.header .logo-box .logo-title {
  font-size: 18px;
  font-family: "HYZhengYuan-DEW";
}
.header-right {
  float: right;
  padding-right: 18px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name-box {
  margin-left: 10px;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
}
.user-name {
  position: relative;
  top: -3px;
  left: -5px;
}
.user-avator {
  font-size: 22px;
}
.user-avator:hover {
  color: #1884cc;
}
.icon-goumaizhongxin {
  color: #454545;
  margin-right: 25px;
  cursor: pointer;
  transition: color 0.2s;
}
.icon-goumaizhongxin:hover {
  color: #1884cc;
}
.icon-goumaizhongxin:hover .icon-goumaizhongxin::before {
  color: #1884cc;
}
.icon-goumaizhongxin::before {
  margin-right: 4px;
}
.icon-goumaizhongxin::after {
  content: "";
  width: 1px;
  height: 14px;
  background: #c7c1c1;
  display: inline-block;
  position: relative;
  left: 18px;
  top: 2px;
}
.logo-img {
  width: 30px;
  height: 30px;
  margin: 0 8px 0 4px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.icon-shousuo3 {
  font-size: 16px;
}
.message-logs {
  color: #575959;
}
</style>
