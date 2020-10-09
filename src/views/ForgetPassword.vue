<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">重置密码</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="请输入手机号">
            <!-- <el-button slot="prepend" icon="el-icon-user"></el-button> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入验证码" v-model="param.password" @keyup.enter.native="submitForm()">
            <el-button slot="append">获取验证码</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入图形验证码" v-model="param.password" @keyup.enter.native="submitForm()">
            <div style="margin-right:-5px" slot="suffix" @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary"login @click="submitForm()">下一步</el-button>
        </div>
        <el-form-item style="text-align: center;" class="login-tips">
          <router-link to="login">已注册，去登录</router-link>
        
        </el-form-item>
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
          username: '',
          password: '',
          checked: false,
        },
        identifyCodes: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        identifyCode: "",
        rules: {
          username: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          password: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
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
      submitForm() {
        this.$refs.login.validate(valid => {
          if (valid) {
            this.$message.success('登录成功');
            localStorage.setItem('ms_username', this.param.username);
            this.$router.push('/');
          } else {
            this.$message.error('请输入账号和密码');
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