<template>
  <div class="forgetPass">
    <div class="top">
      <span class="title">报告生成系统安全中心</span>
      &nbsp;&nbsp;|&nbsp;&nbsp;重置密码
      <router-link to="/login" class="bt">登录</router-link>
    </div>
    <div class="stepBox">
      <el-steps style="width:70%;margin:0 auto;" :active="step" align-center>
        <el-step title="身份验证"></el-step>
        <el-step title="设置新密码"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <div class="contentBox">
      <div v-show="step === 1">
        <el-form ref="ruleform" :hide-required-asterisk="true" label-position="top" :model="ruleForm" :rules="rules">
          <el-form-item prop="userAccount" >
            <h3 slot="label">手机号码</h3>
            <el-input v-model="ruleForm.userAccount" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <h3 slot="label">验证码</h3>
            <el-input v-model="ruleForm.code" placeholder="请输入验证码" class="inputYZM"></el-input>
            <el-popover v-show="!gettingCode" placement="top" trigger="click" v-model="visible">
              <SliderVerification @onSuccess="getCode" ref="verification" />
              <el-button slot="reference" style="float:right;" @click="setCode">获取验证码</el-button>
            </el-popover>
            <el-button v-show="gettingCode" style="float:right;">{{ timer + "s" }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" @click="nextStep()" type="primary">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="step === 2">
        <el-form
          ref="resetPassword"
          :hide-required-asterisk="true"
          label-position="top"
          :model="resetPass"
          :rules="resetPassRules"
        >
          <el-form-item prop="newPassword">
            <h3 slot="label">请输入密码</h3>
            <el-input type="password" v-model="resetPass.newPassword" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="repeatPassword">
            <h3 slot="label">请再次确认</h3>
            <el-input type="password" v-model="resetPass.repeatPassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" @click="nextStep()" type="primary">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="step === 3">
        <div style="text-align:center">
          <i class="iconfont icon icon-chenggong" style="font-size:60px;color:#52C41A"></i><br /><br />
          <h3>重置密码成功</h3>
          <br />
          <span
            >密码重置成功，3s后重新登录。如未自动跳转，请点击 <router-link class="to-pwd" to="/login">登录</router-link></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SliderVerification from "@/components/SliderVerification/index.vue";
import { setTimeout } from "timers";
export default {
  name: "forgetPass",
  components: { SliderVerification },
  data() {
    return {
      step: 1,
      timer: 120,
      visible: false,
      gettingCode: false,
      ruleForm: {
        userAccount: "",
        code: ""
      },
      resetPass: {
        key: "",
        newPassword: "",
        repeatPassword: ""
      },
      rules: {
        userAccount: {
          required: true,
          validator: this.checkPhone
        },
        code: {
          required: true,
          message: "不能为空"
        }
      },
      resetPassRules: {
        newPassword: {
          required: true,
          message: "不能为空"
        },
        repeatPassword: {
          required: true,
          validator: this.checkPass
        }
      }
    };
  },
  methods: {
    nextStep() {
      switch (this.step) {
        case 1:
          this.$refs["ruleform"].validate(valid => {
            if (valid) {
              this.$refs["resetPassword"].resetFields();
              //请求后台返回参数
              this.$http.loginService
                .checkUser({ userAccount: this.ruleForm.userAccount, code: this.ruleForm.code })
                .then(res => {
                  this.step++;
                  this.resetPass.key = res.data;
                });
            } else {
              return false;
            }
          });
          break;
        case 2:
          this.$refs["resetPassword"].validate(valid => {
            if (valid) {
              //请求后台返回参数
              this.$http.loginService.resetPassword(this.resetPass).then(() => {
                this.step++;
                setTimeout(() => {
                  this.$router.push("/login");
                }, 4000);
              });
            } else {
              return false;
            }
          });
          break;
        default:
          break;
      }
    },
    checkPass(rule, value, callback) {
      if (value === "") {
        callback(new Error("不能为空"));
      } else if (value !== this.resetPass.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    checkPhone(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入电话号码"));
      } else {
        let p = new RegExp("^[1][3,4,5,7,8,9][0-9]{9}$"); // 验证手机号
        let m = p.test(value);
        if (!m) {
          callback(new Error("请输入正确电话号码"));
        }
      }
      callback();
    },
    setCode() {
      if (!this.ruleForm.userAccount) {
        setTimeout(() => {
          this.visible = false;
        }, 100);
        this.checkValue("请输入手机号", this.ruleForm.userAccount);
        return;
      }
      if (this.gettingCode) {
        setTimeout(() => {
          this.visible = false;
        }, 100);
        return;
      }
      setTimeout(() => {
        this.$refs["verification"].reset();
      }, 200);
    },
    getCode() {
      this.visible = false;
      this.gettingCode = true;
      this.timer = 120;
      if (!this.ruleForm.userAccount) {
        this.checkValue("请输入手机号", this.ruleForm.userAccount);
        return;
      }
      this.gettingCode ? this.sendCode() : null;
    },
    /**
     * 发送验证码
     */
    sendCode() {
      this.$http.loginService
        .getverificationCode({ userAccount: this.ruleForm.userAccount, codeType: "RESET_PASSWORD" })
        .then(() => {
          this.$refs.verification.reset();
          this.$message.success("短信已发送请注意查收！");
          let t = null;
          setTimeout(() => {
            window.clearInterval(t);
            t = null;
            this.gettingCode = false;
          }, this.timer * 1000);
          t = setInterval(() => {
            this.timer--;
          }, 1000);
        })
        .catch(() => {
          this.gettingCode = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.to-pwd {
  color: #1884cc;
  font-size: 12px;
  font-weight: bold;
}
.forgetPass {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  .top {
    position: relative;
    padding: 1em 2em;
    box-sizing: border-box;
    background-color: #107ac2;
    color: #ffffff;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .bt {
      color: #ffffff;
      border: 1px solid #ffffff;
      padding: 0.5em 1em;
      position: absolute;
      font-size: 14px;
      right: 1em;
      top: 0.8em;
      border-radius: 6px;
    }
  }
  .inputYZM {
    width: 200px !important;
  }
  .stepBox {
    margin-top: 2em;
    text-align: center;
  }
  .contentBox {
    margin-top: 2em;
    text-align: left;
    > div {
      width: 350px;
      margin: 0 auto;
    }
    > div:last-child {
      width: 30%;
      font-size: 12px;
      margin: 0 auto;
    }
  }
}
</style>
