<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="圈子类型：" prop="cirType">
      <el-select v-model="form.cirType" placeholder="请选择圈子类型" class="handle-select mr10">
        <el-option v-for="(item,index) in dictionaryList" :key="index" :label="item.dicName" :value="item.dicId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="圈子名称：" prop="cirName">
      <el-input v-model="form.cirName" placeholder="请输入圈子名称" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="圈子状态：" prop="state">
      <el-select v-model="form.state" placeholder="请选择类型" class="handle-select mr10">
        <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="圈子介绍：" prop="cirIntro" style="width: 1000px;">
      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="form.cirIntro" placeholder="请输入圈子介绍" class="handle-input"></el-input>
      <!-- <UEditor ref="ueditor"></UEditor> -->

    </el-form-item>
    <el-form-item label="圈子头像：" prop="cirUrl" class="personal-icon">
      <label for="cirUrl" icon="el-icon-plus">
        <img v-if="form.cirUrl" :src="form.cirUrl" />
        <img v-else src="~assets/img/headportrait.png" alt="">
        <input style="display: none" id="cirUrl" ref="cirUrl" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange($event,1)" />
      </label>
    </el-form-item>
    <el-form-item label="圈子封面：" prop="cirCover" class="personal-icon">
      <label for="cirCover" icon="el-icon-plus">
        <img v-if="form.cirCover" :src="form.cirCover" />
        <img v-else src="~assets/img/headportrait.png" alt="">
        <input style="display: none" id="cirCover" ref="cirCover" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange($event,2)" />
      </label>
    </el-form-item>
  
    <el-form-item>
      <el-button @click="goback">返 回</el-button>
      <el-button type="primary" @click="saveEdit">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  // import UEditor from '@/components/ueditor.vue'

  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      stateList: {
        type: Array,
        default() {
          return []
        }
      },

      dictionaryList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        rules: {
          state: [{ required: true, message: "请选择圈子状态", trigger: "blur" }],
          cirType: [{ required: true, message: "请选择圈子类型", trigger: "blur" }],
          cirName: [{ required: true, message: "请输入圈子名称", trigger: "blur" }],
          cirCover: [{ required: true, message: "请输入圈子封面", trigger: "blur" }],
          cirUrl: [{ required: true, message: "请输入圈子头像", trigger: "blur" }],
          cirIntro: [{ required: true, message: "请输入圈子头像", trigger: "blur" }],
        },
      }
    },
    // watch: {
    //   form() {
    //     this.$refs.ueditor.setUEContent(this.form.cirIntro)
    //   }
    // },
    methods: {
      //上传图片
      handleFileChange(e, ind) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            if (ind == 1) {
              this.form.cirUrl = res.data;
            } else {
              this.form.cirCover = res.data;
            }
          }
        });
      },
      //增加/修改圈子
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // this.form.cirIntro = this.$refs.ueditor.getUEContent();

            if (this.$route.query.cirId) {
              this.$post("/circle/updateCircle", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.$router.go(-1)
                }
              })
            } else {
              this.$post("/circle/insertCircle", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.$router.go(-1)
                }
              })
            }
          }
        })
      },
      goback() {
        this.$router.go(-1)
      }
    },
    // components: {
    //   UEditor
    // }
  }
</script>
<style scoped>
  .handle-select {
    width: 400px;
  }

  .handle-input {
    width: 400px;
    display: inline-block;
  }

  img {
    width: 100px;
    /* height: 100px;
    border-radius: 50%; */
  }
</style>