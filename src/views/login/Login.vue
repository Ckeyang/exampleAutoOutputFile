<template>
  <div class="login-box">
    <div class="from-box">
      <div class="logo-box">
        <div class="logo">
          <img src="../../assets/logo.png" alt="LOGO" />
        </div>
        <p class="logo-text">报告生成系统</p>
      </div>
      <div class="login-item" v-if="loginType === 'A'">
        <p class="error">{{ errorText }}</p>
        <el-input
          placeholder="手机号码或邮箱"
          v-model="ruleForm.userAccount"
          @blur="checkName"
          clearable
          @keyup.enter.native="submit"
        ></el-input>
        <i class="user-icon icon icon-yonghuming iconfont"></i>
      </div>
      <div class="login-item" v-if="loginType === 'A'">
        <el-input
          placeholder="密码"
          type="passWord"
          v-model="ruleForm.password"
          @blur="checkPwd"
          clearable
          @keyup.enter.native="submit"
        ></el-input>
        <i class="password-icon icon icon-mima iconfont"></i>
        <!-- <i class="password-btn_icon icon" :class="{'show-pwd_icon':isShowPawd}" @click="isShowPawd=!isShowPawd"></i> -->
      </div>

      <p class="error" v-if="loginType === 'B'" style="padding-right:40px;">{{ errorText }}</p>
      <div class="login-item" v-if="loginType === 'B'">
        <el-input placeholder="手机号码" @blur="checkName" v-model="ruleForm.userAccount" clearable></el-input>
        <i class="password-icon icon iconfont" style="color:#262626">+86</i>
        <!-- <i class="password-btn_icon icon" :class="{'show-pwd_icon':isShowPawd}" @click="isShowPawd=!isShowPawd"></i> -->
      </div>
      <div class="login-item" v-if="loginType === 'B'">
        <el-input placeholder="动态验证码" v-model="ruleForm.code" clearable style="width:150px;"></el-input>
        <el-popover v-show="!gettingCode" placement="top" trigger="click" v-model="visible">
          <SliderVerification @onSuccess="getCode" ref="verification" />
          <el-button slot="reference" style="float:right;" @click="setCode">获取验证码</el-button>
        </el-popover>
        <el-button v-show="gettingCode" style="float:right;">{{ timer + "s" }}</el-button>
        <!-- <i class="password-btn_icon icon" :class="{'show-pwd_icon':isShowPawd}" @click="isShowPawd=!isShowPawd"></i> -->
      </div>
      <div class="login-item rememberP" v-if="loginType === 'A'">
        <el-checkbox v-model="rememberP">下次自动登录</el-checkbox>
        <router-link to="/forgetPass" class="to-pwd">忘记密码?</router-link>
      </div>
      <!-- <div class="login-item">
            <slider-login v-if="isRender" @isSliderPass="getSliderPass"></slider-login>
      </div>-->
      <div class="login-item">
        <el-button type="primary" style="width: 100%;margin-top: 14px" @click="submit" :loading="rulePass">登录</el-button>
      </div>
      <div class="login-item login-type">
        <span class="dx" @click="changeType">{{ loginType === "A" ? "短信快捷登录" : "账号密码登录" }}</span>
        <router-link to="/applyProbation" class="to-pwd">申请试用</router-link>
      </div>
      <div class="login-foot">
        还没有账号？
        <router-link to="/register" class="to-reg">立即注册</router-link>
      </div>
    </div>
    <p
      style="text-align: center; position: absolute;bottom: 50px;width:100%;font-size: 14px;
    color: #999;"
    >
      技术支持: 成都中环康源信息技术有限公司
    </p>
  </div>
</template>
<script>
import SliderVerification from "@/components/SliderVerification/index.vue";
import Bus from "@/views/common/bus.js";
import CryptoJS from "crypto-js"; //加密密码
import UaParser from "ua-parser-js"; //获取ua
export default {
  data() {
    return {
      rememberP: false, //是否记住密码
      ruleForm: {
        userAccount: "",
        password: "",
        code: ""
      },
      visible: false,
      gettingCode: false,
      timer: 120,
      loginType: "A",
      errorText: "", //错误提示信息
      rulePass: false, //通过所有规则，可以进行后台验证
      dataImg: ["../../assets/playerImg.png"]
    };
  },
  components: { SliderVerification },
  created() {
    //七天过期
    if (localStorage._info) {
      if (new Date().getTime() - JSON.parse(localStorage._info).createdTime > 86400 * 7 * 1000) {
        localStorage.removeItem("_info");
      } else {
        this.ruleForm.userAccount = JSON.parse(localStorage._info)._u;
        this.ruleForm.password = CryptoJS.AES.decrypt(JSON.parse(localStorage._info)._p, "zhky").toString(CryptoJS.enc.Utf8);
        this.rememberP = true;
      }
    }
    const ua = new UaParser().getBrowser(); //获取浏览器信息
    if (ua.name !== "Chrome") {
      this.$notify({
        title: "提示",
        type: "info",
        dangerouslyUseHTMLString: true,
        message: "<strong>建议使用Chrome浏览器进行操作</strong>"
      });
    }
  },
  methods: {
    setCode() {
      if (!this.ruleForm.userAccount) {
        const t = setTimeout(() => {
          this.visible = false;
          clearTimeout(t);
        }, 100);
        this.checkValue("请输入手机号", this.ruleForm.userAccount);
        return;
      }
      if (this.gettingCode) {
        const t = setTimeout(() => {
          this.visible = false;
          clearTimeout(t);
        }, 100);
        return;
      }
      const t = setTimeout(() => {
        this.$refs["verification"].reset();
        clearTimeout(t);
      }, 200);
    },
    checkPhone(value) {
      let p = new RegExp("^[1][3,4,5,7,8,9][0-9]{9}$"); // 验证手机号
      let m = p.test(value);
      if (!m) {
        return false;
      } else {
        return true;
      }
    },
    getCode() {
      this.visible = false;
      if (!this.ruleForm.userAccount || !this.checkPhone(this.ruleForm.userAccount)) {
        this.$message.error("请输入正确的号码");
        return;
      }
      this.gettingCode = true;
      this.timer = 120;
      this.gettingCode ? this.sendCode() : null;
    },
    /**
     * 发送验证码
     */
    sendCode() {
      this.$http.loginService
        .getverificationCode({ userAccount: this.ruleForm.userAccount, codeType: "SYSTEM_LOGIN" })
        .then(() => {
          this.$refs.verification.reset();
          this.$message.success("短信已发送请注意查收！");
          let t = null;
          t = setInterval(() => {
            this.timer--;
          }, 1000);
          setTimeout(() => {
            window.clearInterval(t);
            t = null;
            this.gettingCode = false;
          }, this.timer * 1000);
        })
        .catch(() => {
          this.gettingCode = false;
        });
    },
    changeType() {
      this.ruleForm = {
        userAccount: "",
        password: "",
        code: ""
      };
      this.loginType = this.loginType === "A" ? "B" : "A";
    },
    RememberUserMesg() {
      //七天过期
      if (!this.rememberP && localStorage._info) {
        localStorage.removeItem("_info");
      } else if (this.rememberP) {
        if (localStorage._info) {
          localStorage._info = JSON.stringify({
            _u: this.ruleForm.userAccount,
            _p: CryptoJS.AES.encrypt(this.ruleForm.password, "zhky").toString()
          });
        } else {
          localStorage._info = JSON.stringify({
            _u: this.ruleForm.userAccount,
            _p: CryptoJS.AES.encrypt(this.ruleForm.password, "zhky").toString(),
            createdTime: new Date().getTime()
          });
        }
      }
    },
    checkValue(text, content) {
      content == "" ? (this.errorText = text) : (this.errorText = "");
    },
    checkName(e) {
      this.checkPhone(e.target.value);
      this.checkValue("请输入手机号", e.target.value);
    },
    checkPwd(e) {
      this.checkValue("请输入密码", e.target.value);
    },
    clearTags() {
      this.$store.commit({
        type: "tag_changeTagsList",
        tags: []
      });
    },
    //提交信息
    submit() {
      if (this.loginType === "A") {
        if (!this.ruleForm.userAccount) {
          this.errorText = "请输入手机号";
        } else if (!this.ruleForm.password) {
          this.errorText = "请输入密码";
        } else {
          this.errorText = "";
          this.rulePass = true;
          this.$http.loginService
            .login(this.ruleForm)
            .then(() => {
              this.clearTags(); //清楚所有的tags
              this.RememberUserMesg(); //记住密码
              let token = sessionStorage.token;
              this.$http.userService.getLoginUser().then(res => {
                let info = res.data;
                sessionStorage.setItem("userInfo", JSON.stringify(info || {}));
                sessionStorage.setItem("userName", info ? info.realName : "");
                sessionStorage.setItem("userId", info ? info.id : "");
                try {
                  window.postMessage("login");
                } catch (e) {
                  Bus.$emit("login");
                }
                this.$router.push(
                  window.location.hash.split("redirect=")[1]
                    ? window.location.hash.split("redirect=")[1].replace(/\%2F/g, "/")
                    : "/index"
                );
              });
            })
            .catch(err => {
              this.rulePass = false;
            });
        }
      } else {
        if (!this.ruleForm.userAccount) {
          this.errorText = "请输入手机号";
        } else {
          this.errorText = "";
          this.rulePass = true;
          this.$http.loginService
            .shortMessageLogin(this.ruleForm)
            .then(() => {
              this.clearTags(); //清楚所有的tags
              this.RememberUserMesg(); //记住密码
              let token = sessionStorage.token;
              this.$http.userService.getLoginUser().then(res => {
                let info = res.data;
                sessionStorage.setItem("userInfo", JSON.stringify(info || {}));
                sessionStorage.setItem("userName", info ? info.realName : "");
                sessionStorage.setItem("userId", info ? info.id : "");
                try {
                  window.postMessage("login");
                } catch (e) {
                  Bus.$emit("login");
                }
                this.$router.push(
                  window.location.hash.split("redirect=")[1]
                    ? window.location.hash.split("redirect=")[1].replace(/\%2F/g, "/")
                    : "/index"
                );
              });
            })
            .catch(err => {
              this.rulePass = false;
            });
        }
      }
    }
  }
};
</script>
<style scoped>
.dx {
  color: #999999;
  font-size: 12px;
  cursor: pointer;
}
.login-box {
  width: 100%;
  height: 100%;
  background: #f0f3f5;
}
.logo-box {
  text-align: center;
}
.logo {
  margin: 30px auto 20px;
}
.logo-text {
  font-family: MicrosoftYaHei;
  font-weight: 400;
  font-size: 22px;
  margin-bottom: 20px;
  color: rgba(38, 38, 38, 1);
}
.logo-word {
  float: left;
  width: 200px;
  font-size: 22px;
  font-weight: bold;
  margin-left: 15px;
  color: #fff;
  margin-top: 1px;
}

.login-box >>> .el-input__inner {
  background: #fff;
  padding-left: 40px;
}
.login-box >>> .el-input__inner::placeholder {
  color: #bfbfbf;
}
.login-box >>> .el-input__suffix {
  right: 0;
}
.from-box {
  position: absolute;
  top: 17vh;
  right: 0;
  left: 0;
  margin: auto;
  /* box-shadow: 4px 0px 15px rgba(8, 83, 214, 0.45);  */
  width: 360px;
  height: 490px;
  background: #fff;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 5px;
}

.login-item {
  padding: 0 40px;
  margin-bottom: 22px;
  position: relative;
}

.icon {
  height: 40px;
  width: 40px;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  position: absolute;
  top: 0px;
  left: 40px;
  line-height: 38px;
  color: #999999;
}
.user-icon {
  top: 21px;
}
.password-btn_icon {
  left: auto;
  cursor: pointer;
}

.error {
  height: 16px;
  color: #ff6e6e;
  font-size: 13px;
  margin-left: 13px;
  margin-bottom: 6px;
  text-align: right;
}

.to-reg {
  margin-left: 2px;
  color: #1890ff;
  font-size: 12px;
  font-weight: bold;
}

/* .to-reg a {
  color: #0ba0e0;
  font-weight: bold;
} */
.login-foot {
  position: relative;
  top: 15px;
  text-align: center;
  color: #595959;
  font-size: 12px;
}
.rememberP {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  transform: translateY(-10px);
}
.login-type {
  margin-top: 15px;
}
.to-pwd {
  float: right;
  color: #1884cc;
  font-size: 12px;
  font-weight: bold;
}

.to-pwd:hover,
.to-reg:hover {
  text-decoration: underline;
}
</style>
