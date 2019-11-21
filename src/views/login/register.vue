<template>
  <div class="login-box">
    <div class="from-box">
      <div class="logo-box">
        <div class="logo">
          <img src="../../assets/logo.png" alt="LOGO" />
        </div>
        <p class="logo-text">欢迎加入报告生成系统</p>
      </div>
      <el-form :model="form" :rules="rules" status-icon ref="regForm" size="medium" label-position="top" label-width="100px">
        <el-form-item label="" prop="name" class="login-item">
          <el-input placeholder="企业名称" v-model="form.name" clearable @keyup.enter.native="submit"></el-input>
        </el-form-item>
        <el-form-item label="" prop="unifiedSocialCreditCode" class="login-item">
          <el-input
            placeholder="统一社会信用代码"
            v-model="form.unifiedSocialCreditCode"
            clearable
            @keyup.enter.native="submit"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="adminRealName" class="login-item">
          <el-input placeholder="负责人姓名" v-model="form.adminRealName" clearable @keyup.enter.native="submit"></el-input>
        </el-form-item>
        <el-form-item label="" prop="email" class="login-item">
          <el-input placeholder="负责人邮件" v-model="form.email" clearable @keyup.enter.native="submit"></el-input>
        </el-form-item>
        <el-form-item label="" prop="mobilePhoneNumber" class="login-item">
          <el-input placeholder="负责人手机" v-model="form.mobilePhoneNumber" clearable @keyup.enter.native="submit"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="login-item" :error="codeError">
          <div class="code-box">
            <el-input
              placeholder="短信验证码"
              v-model="form.code"
              clearable
              style="width:150px;"
              @keyup.enter.native="submit"
            ></el-input>
            <el-popover placement="top" width="310" v-model="isShowPopover" trigger="click">
              <slider-verification @onSuccess="getCode" ref="sliderVerification" />
              <el-button slot="reference" :disabled="disabled" @click="verificationBtn">{{
                timer ? stepTime + "s" : "获取验证码"
              }}</el-button>
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
      <div class="login-item">
        <el-button type="primary" style="width: 100%;margin-top: 14px" @click="submit" :loading="loading">注册</el-button>
      </div>
      <div class="to-login">
        已有账号？
        <router-link to="/login">直接登录</router-link>
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
export default {
  components: { SliderVerification },
  data() {
    const errorMesg = {
      email: "已存在该邮件地址",
      mobilePhoneNumber: "已存在该手机号",
      unifiedSocialCreditCode: "已存在该统一社会信用代码"
    };
    const validateRepeat = (rule, value, callback) => {
      let map = new Map();
      map.set(rule.field, value);
      this.$http.loginService
        .checkRepeat({
          email: map.has("email") ? map.get("email") : null,
          mobilePhoneNumber: map.has("mobilePhoneNumber") ? map.get("mobilePhoneNumber") : null,
          unifiedSocialCreditCode: map.has("unifiedSocialCreditCode") ? map.get("unifiedSocialCreditCode") : null
        })
        .then(() => {
          return callback();
        })
        .catch(() => {
          return callback(new Error(errorMesg[rule.field]));
        });
    };
    const validateSpace = (rule, value, callback) => {
      if (/^[ ]+$/.test(value)) {
        return callback(new Error("不能全为空格"));
      }
      return callback();
    };
    const validField = (rule, value, callback) => {
      if (!/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(value)) {
        return callback(new Error("社会信用代码格式不正确"));
      }
      return callback();
    };
    const validatePhone = (rule, value, callback) => {
      if (value.length !== 11 || !/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号格式不正确"));
      }
      return callback();
    };
    return {
      form: {
        adminRealName: "",
        mobilePhoneNumber: "",
        unifiedSocialCreditCode: "",
        name: "",
        code: "",
        email: ""
      },
      codeError: null,
      rules: {
        email: [
          { required: true, message: "请输入邮件地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮件地址", trigger: ["blur", "change"] },
          { validator: validateRepeat, trigger: "blur" }
        ],
        adminRealName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          { validator: validateSpace, trigger: "blur" }
        ],
        mobilePhoneNumber: [
          { required: true, message: "请输入负责人手机", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
          { validator: validateRepeat, trigger: "blur" }
        ],
        unifiedSocialCreditCode: [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" },
          { validator: validateSpace, trigger: "blur" },
          { validator: validField, trigger: "blur" },
          { validator: validateRepeat, trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }, { validator: validateSpace, trigger: "blur" }],
        code: [
          { required: true, message: "请输入6位验证码", trigger: "blur" },
          { min: 6, max: 6, message: "请输入6位验证码", trigger: "blur" }
        ]
      },
      timer: null,
      stepTime: 120,
      isShowPopover: false,
      phoneIsRepeat: true,
      disabled: false, // 是否禁用获取验证码
      loading: false,
      errorText: "" //错误提示信息
    };
  },
  watch: {
    isShowPopover(val) {
      val && this.$refs.sliderVerification.reset();
    }
  },
  methods: {
    countDown() {
      this.timer = setInterval(() => {
        this.stepTime--;
        if (this.stepTime <= 0) {
          this.disabled = false;
          this.stepTime = 120;
          clearInterval(this.timer);
        }
      }, 1000);
    },
    // 校验是否可以获取验证码
    async verificationBtn() {
      const t1 = setTimeout(() => {
        this.isShowPopover = false;
        clearTimeout(t1);
      }, 0);
      const result = ["email", "name", "unifiedSocialCreditCode", "mobilePhoneNumber", "adminRealName"].filter(item => {
        return this.validateFn(item);
      });
      let flag = false;
      if (result.length === 5) {
        flag = await this.validateService();
      }
      const t2 = setTimeout(() => {
        this.isShowPopover = flag;
        clearTimeout(t2);
      }, 20);
    },
    validateFn(prop) {
      let flag = null;
      this.$refs["regForm"].validateField(prop, errMesg => {
        flag = errMesg;
      });
      return !flag;
    },
    // 异步校验
    validateService() {
      const { email, unifiedSocialCreditCode, mobilePhoneNumber } = this.form;
      const fns = [email, unifiedSocialCreditCode, mobilePhoneNumber].map(item =>
        this.$http.loginService.checkRepeat({ info: item })
      );
      return Promise.all(fns)
        .then(res => {
          return true;
        })
        .catch(err => {
          return false;
        });
    },
    getCode() {
      const params = {
        userAccount: this.form.mobilePhoneNumber,
        codeType: "SYSTEM_REGISTRATION"
      };
      this.$http.loginService.getverificationCode(params).then(res => {
        this.$message({
          message: "验证码发送成功！",
          type: "success"
        });
        this.countDown();
      });
      this.isShowPopover = false;
      this.disabled = true;
    },
    submit() {
      this.$refs["regForm"].validate(valid => {
        if (!valid) return;
        this.codeError = "";
        this.$http.loginService
          .addFormalAccount(this.form)
          .then(res => {
            this.$alertComponent(
              '注：信息审核中！&nbsp</br><span style="margin-left:24px">我们将2个工作日内为你反馈审核结果请保持手机畅通！</span>',
              "注册成功",
              {
                confirmButtonText: "确定",
                type: "success",
                dangerouslyUseHTMLString: true
              }
            )
              .then(state => {
                this.$router.push("/login");
              })
              .catch(() => {});
          })
          .catch(err => {
            this.form.code = "";
            this.codeError = "验证码输入错误";
          });
      });
    }
  }
};
</script>

<style scoped>
.login-box {
  width: 100%;
  height: 100%;
  background: #f0f3f5;
}
.phone >>> .el-input__inner {
  padding-left: 40px;
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
.code-box {
  display: flex;
  justify-content: space-between;
}
.login-box >>> .el-input__inner::placeholder {
  color: #bfbfbf;
}
.login-box >>> .el-input__suffix {
  right: 0;
}
.from-box {
  position: absolute;
  top: 7vh;
  right: 0;
  left: 0;
  margin: auto;
  /* box-shadow: 4px 0px 15px rgba(8, 83, 214, 0.45);  */
  width: 360px;
  height: 660px;
  background: #fff;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 5px;
}

.login-item {
  padding: 0 40px;
  position: relative;
}

.icon {
  height: 40px;
  width: 40px;
  font-size: 14px;
  text-align: center;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  line-height: 40px;
  position: absolute;
  top: 0px;
  left: 40px;
  line-height: 38px;
  color: #999999;
}
.phone-icon {
  top: 23px;
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

.to-login {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #595959;
  font-size: 12px;
  margin-top: 40px;
}

.to-login a {
  color: #1890ff;
  font-weight: bold;
}
.to-login a:hover {
  text-decoration: underline;
}
</style>
