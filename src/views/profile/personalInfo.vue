<template>
  <div class="container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色：" prop="rId">
        <el-select v-model="form.rId" placeholder="请选择角色" class="handle-select mr10">
          <el-option v-for="(item,index) in rolesList" :key="index" :label="item.rName" :value="item.rId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号：" prop="account">
        <el-input v-model="form.account" placeholder="请输入账号" class="handle-input mr10"></el-input>
      </el-form-item>
      <!-- <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" class="handle-input mr10"></el-input>
      </el-form-item> -->
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" class="handle-input mr10"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="username">
        <el-input v-model="form.username" placeholder="请输入姓名" class="handle-input mr10"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-select size="medium" v-model="form.sex" placeholder="请选择性别" class="handle-select mr10">
          <el-option key="1" label="男" value="男"></el-option>
          <el-option key="2" label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="头像：" class="personal-icon" prop="headportrait">
        <label for="inputId" icon="el-icon-plus">
          <img v-if="form.headportrait" :src="form.headportrait" class="img" />

          <img v-else src="~assets/img/headportrait.png" alt="">
          <input style="display: none" id="inputId" ref="input" type="file"
            accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
        </label>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        rolesList: [],
        form: {
          rId: '',
          account: '',
          mobile: '',
          username: '',
          sex: '',
          headportrait: ''
        },
        rules: {
          rId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
          account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
          mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
          headportrait: [{ required: true, message: '请上传头像', trigger: 'blur' }],
          // password: [{ required: true, message: '请输入密码', trigger: 'blur' }],

        }
      }
    },
    created() {
      this.getRoles();
      this.getMangerInfo()
    },
    methods: {
      //获取角色列表
      getRoles() {
        this.$post("/userinfo/getRole", { state: 1 }).then(res => {
          if (res.code == 200) {
            this.rolesList = res.data;
          }
        })
      },
      getMangerInfo() {
      
        this.$post("/userinfo/showManger", { mid:JSON.parse(sessionStorage.getItem("userinfo")).mid}).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        console.log(formdata);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.headportrait = res.data;
          }
        });
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.mid =JSON.parse(sessionStorage.getItem("userinfo")).mid
            this.$post("/userinfo/updateManger", this.form).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.getMangerInfo()
                let userinfo = {
                  mtoken:  this.form.mtoken,
                  account:  this.form.account,
                  headportrait:  this.form.headportrait,
                  mid:  this.form.mid
                }
                sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
                window.location.reload()
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .handle-select,
  .handle-input {
    width: 400px;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>