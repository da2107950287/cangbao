<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">忘记密码</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="mobile">
          <el-input v-model="param.mobile" placeholder="请输入手机号">
          </el-input>
        </el-form-item>
        <el-form-item prop="verify">
          <el-input placeholder="请输入验证码" v-model="param.verify">
            <el-button slot="append" @click="codeClick">{{codeMsg}}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()">
            <!-- <div style="margin-right:-5px" slot="suffix" @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div> -->
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" login @click="submitForm()">下一步</el-button>
        </div>
      </el-form>

    </div>
  </div>
</template>

<script>
  import SIdentify from "components/identify/Identify";
  export default {
    data: function () {
      return {
        param: {
          mobile: '',
          verify: '',
          password: '',
        },
        codeMsg: '获取验证码',
        totalTime: 60,//倒计时60s
        canClick: false,//短信验证码开关
        identifyCodes: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        identifyCode: "",
        rules: {
          mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          verify: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
      };
    },
    created() {
      this.refreshCode();
    },
    methods: {
      // 生成随机数
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },

      // 切换验证码
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },

      // 生成四位随机验证码
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
          ];
        }
      },
      //点击验证码
      codeClick() {
        if (this.param.mobile) {
          this.canClick = true;
        } else {
          this.canClick = false;
        }
        if (!this.canClick) return;
        this.canClick = true;
        this.codeMsg = this.totalTime + "s";
        //60秒倒计时
        let clock = window.setInterval(() => {
          this.totalTime--;
          this.codeMsg = this.totalTime + "s";
          if (this.totalTime < 0) {
            window.clearInterval(clock);
            this.codeMsg = "重新发送验证码";
            this.totalTime = 60;
            this.canClick = true; //这里重新开启
          }
        }, 1000);
        this.$post("/userinfo/send_sms", { account: this.param.mobile }).then(
          (res) => {
            switch (res.code) {
              case "200":
                this.$message.success(res.msg);
                break;
              case "500":
                this.$message.error(res.msg);
                break;
              default:
                console.log(res.msg);
                this.$toast("网络故障，发送短信失败");
                break;
            }
          }
        );
      },

      submitForm() {
        this.$refs.login.validate(valid => {
          if (valid) {
            this.$post("/userinfo/forgetVerify", this.param).then(res => {
              if (res.code == 200) {
                this.$router.push('/login');
              }
            })
          } else {
            this.$message.error('请输入账号、验证码和密码');
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    components: {
      SIdentify
    }
  };
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    margin-bottom: 0;
    font-size: 14px;
    color: #fff;
  }
</style>