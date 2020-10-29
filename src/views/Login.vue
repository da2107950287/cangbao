<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">藏宝后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="account">
          <el-input v-model="param.account" placeholder="请输入账号">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()">
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="login-tips margin0">
          <el-checkbox v-model="checked" class="login-tips" style="float: left;">记住密码</el-checkbox>
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
  import CryptoJS from "crypto-js";
  export default {
    data: function () {
      return {
        param: {
          account: '',
          password: '',
          type: 1
        },
        checked: true,
        rules: {
          account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
      };
    },
    mounted() {

      this.getParam()

      // this.getCookie()
    },
    methods: {
      getParam() {
        var bytes1 = CryptoJS.AES.decrypt(this.$cookies.get("account"), "secretkey123");
        this.param.account = bytes1.toString(CryptoJS.enc.Utf8);
        var bytes2 = CryptoJS.AES.decrypt(this.$cookies.get("password"), "secretkey123");
        this.param.password = bytes2.toString(CryptoJS.enc.Utf8);
      },
      submitForm() {
        let that = this;
        this.$refs.login.validate(valid => {
          if (valid) {
            this.$post("/userinfo/login", this.param).then(res => {
              if (res.code == 200) {
                if (this.checked) {
                  // this.setCookie(this.param.account, this.param.password, 7)
                  this.$cookies.set("account", CryptoJS.AES.encrypt(this.param.account + '', "secretkey123").toString(),-1)
                  this.$cookies.set("password", CryptoJS.AES.encrypt(this.param.password + '', "secretkey123").toString(), -1)
                } else {
                  // this.clearCookie()
                  this.$cookies.remove("account")
                  this.$cookies.remove("password")
                }
                localStorage.setItem("rememberPsw", this.checked);
                that.$message.success('登录成功');
                // cookie.setCookie("power",JSON.stringify(res.data.Power),{expires:7})
                localStorage.setItem("power", JSON.stringify(res.data.Power))
                let userinfo = {
                  mtoken: res.data.data.mtoken,
                  account: res.data.data.account,
                  headportrait: res.data.data.headportrait,
                  mid: res.data.data.mid
                }
                this.$cookies.set('userinfo', JSON.stringify(userinfo))
                // localStorage.setItem('userinfo', JSON.stringify(userinfo));
                that.$router.push('/dashboard');
              }
            })
          } else {
            this.$message.error('请输入账号和密码');
            console.log('error submit!!');
            return false;
          }
        });
      },
      //设置cookie
      setCookie(account, password, exdays) {
        // Encrypt，加密账号密码
        var cipherPortId = CryptoJS.AES.encrypt(account + '', "secretkey123").toString();
        var cipherPsw = CryptoJS.AES.encrypt(password + '', "secretkey123").toString();
        console.log(cipherPortId + '/' + cipherPsw)//打印一下看看有没有加密成功
        var exdate = new Date(); //获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        //字符串拼接cookie，为什么这里用了==，因为加密后的字符串也有个=号，影响下面getcookie的字符串切割，你也可以使用更炫酷的符号。
        window.document.cookie = "account" + "==" + cipherPortId + ";path=/;expires=" + exdate.toGMTString();
        window.document.cookie = "password" + "==" + cipherPsw + ";path=/;expires=" + exdate.toGMTString();
      },

      //读取cookie
      getCookie() {
        if (document.cookie.length > 0) {
          var arr = document.cookie.split("; "); //这里显示的格式请根据自己的代码更改
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split("=="); //根据==切割
            //判断查找相对应的值
            if (arr2[0] == "account") {
              // Decrypt，将解密后的内容赋值给账号
              var bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey123");
              this.param.account = bytes.toString(CryptoJS.enc.Utf8);
            } else if (arr2[0] == "password") {
              // Decrypt，将解密后的内容赋值给密码
              var bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey123");
              this.param.password = bytes.toString(CryptoJS.enc.Utf8);
            }
          }
        }
      },
      //清除cookie
      clearCookie: function () {
        this.setCookie("", "", -1);
      }
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

  .margin0 {
    margin-bottom: 5px;

  }

  .login-tips {
    font-size: 14px;
    color: #fff;
  }
</style>