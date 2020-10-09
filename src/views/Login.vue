<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">藏宝后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="请输入账号">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="margin0">
          <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()">
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="login-tips margin0">
          <el-checkbox v-model="param.checked" class="login-tips" style="float: left;">记住密码</el-checkbox>
          <router-link to="forgetPassword" style="float: right;">忘记密码</router-link>
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <!-- <el-form-item style="text-align: center;" class="margin0">
          <router-link to="forgetPassword">立即注册&nbsp;</router-link>|
          
        </el-form-item> -->
        <p class="login-tips">登录遇到问题请联系客服：400-239849823。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        param: {
          username: '',
          password: '',
          checked: false,
        },
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
      };
    },
    methods: {
      submitForm() {
        this.$refs.login.validate(valid => {
          if (valid) {
            this.$post("/userinfo/login",{
              account:"admin",
              password:'123456'
            }).then(res=>{
              this.$message.success('登录成功');
            // localStorage.setItem('ms_username', this.param.username);
            this.$router.push('/');
            })
         
          } else {
            this.$message.error('请输入账号和密码');
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
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
.margin0{
  margin-bottom: 5px;

}
  .login-tips {
    font-size: 14px;
    color: #fff;
  }
</style>