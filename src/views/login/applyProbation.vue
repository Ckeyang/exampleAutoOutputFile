<template>
  <div class="login-box">
    <div class="from-box">
      <div class="logo-box">
        <div class="logo">
          <img src="../../assets/logo.png" alt="LOGO" />
        </div>
        <p class="logo-text">欢迎加入报告生成系统</p>
      </div>
      <div class="login-item phone">
        <p class="error">{{errorText}}</p>
        <el-input
          placeholder="手机号码"
          v-model="form.userAccount"
          @blur="checkPhone"
          clearable
          @keyup.enter.native="submit"
        ></el-input>
        <span class="icon phone-icon">+86</span>
      </div>
      <div class="login-item code-box">
        <el-input
          placeholder="短信验证码"
          v-model="form.code"
          clearable
          style="width:150px;"
          @keyup.enter.native="submit"
        ></el-input>
        <el-popover
          placement="top"
          width="310"
          v-model="isShowPopover"
          trigger="click">
          <slider-verification @onSuccess="getCode" ref='sliderVerification'/>
          <el-button  slot="reference" :disabled="disabled">{{ timer ? stepTime+'s' :'获取验证码'}}</el-button>
        </el-popover>
      </div>
      <div class="login-item">
        <el-button
          type="primary"
          style="width: 100%;margin-top: 14px"
          @click="submit"
          :loading="loading"
        >申请试用</el-button>
      </div>
      <div class="to-login">已有账号？
          <router-link to="/login">直接登录</router-link>
      </div>
    </div>
    <p
      style="text-align: center; position: absolute;bottom: 50px;width:100%;font-size: 14px;
    color: #999;"
    >技术支持: 成都中环康源信息技术有限公司</p>
  </div>
</template>

<script>
import SliderVerification from "@/components/SliderVerification/index.vue";
export default {
  components: { SliderVerification },
  data() {
    return {
      form: {
        userAccount: "",
        code: ""
      },
      timer:null,
      stepTime:120,
      isShowPopover:false,
      phoneIsRepeat:true, 
      disabled:true, // 是否禁用获取验证码
      loading:false,
      errorText: "" //错误提示信息
    };
  },
  watch:{
    isShowPopover(val){
      console.log(this.$refs)
      val && this.$refs.sliderVerification.reset()
    }
  },
  methods: {
    countDown(){
      this.timer = setInterval(()=>{
        this.stepTime -- 
        if(this.stepTime<=0){
          this.disabled = false
          this.stepTime = 120;
          clearInterval(this.timer)
        }
      },1000)
    },
    getCode(){
      const params = {
        userAccount: this.form.userAccount,
        codeType:'SYSTEM_REGISTRATION'
      }
      this.$http.loginService.getverificationCode(params).then(res =>{
        this.$message({
          message: '验证码发送成功！',
          type: 'success'
        });
        this.countDown()
      })
      this.isShowPopover = false
      this.disabled = true
    },
    // 检查是否已注册
    checkPhone(){
      const userAccount = this.form.userAccount
      if(!userAccount){
        this.errorText = '请输入手机号'
        this.disabled = true
      }else if(userAccount.length !== 11 || !(/^1[34578]\d{9}$/).test(userAccount)){
        this.errorText = '手机号格式不正确'
        this.disabled = true
      }else{
        this.errorText = ''
        this.$http.loginService.checkPhoneIsRepeat({mobilePhoneNumber:this.form.userAccount}).then(res =>{
          this.disabled = false
        }).catch(err =>{
          this.disabled = true
        })
      }
    },
    submit(){
      const { code , userAccount} = this.form
      if(code && userAccount && !this.errorText){
        const params = {
          code,
          mobilePhoneNumber:userAccount
        }
        this.$http.loginService.addTrialAccount(params).then(res =>{
          this.$alertComponent('注：试用期结束后试用数据不保留（试用期：7天）！&nbsp</br><span style="margin-left:24px">默认密码为当前手机号码，请及时去修改</span>','试用申请成功', {
            confirmButtonText: "确定",
            type:'success',
            dangerouslyUseHTMLString:true
          })
          .then((state)=>{
            this.$router.push('/login')
          }).catch(()=>{})
        }).catch(err =>{
          this.form.code = ''
        })
      } 
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
.phone >>> .el-input__inner{
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
.code-box{
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
  top: 17vh;
  right: 0;
  left: 0;
  margin: auto;
  /* box-shadow: 4px 0px 15px rgba(8, 83, 214, 0.45);  */
  width: 360px;
  height: 470px;
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
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #999999;
  font-size: 12px;
  margin-top: 65px;
}

.to-login a {
  color: #0ba0e0;
  font-weight: bold;
}
.to-login a:hover {
  text-decoration: underline;
}
</style>

