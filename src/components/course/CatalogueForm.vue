<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="目录名称：" prop="catName">
      <el-input v-model="form.catName" placeholder="请输入课程名称" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="目录类型：" prop="catType">
      <el-radio v-model="form.catType" label="1">视频</el-radio>
      <el-radio v-model="form.catType" label="2">图文</el-radio>
    </el-form-item>
    <el-form-item label="课程状态：" prop="state">
      <el-radio v-model="form.state" label="1">上架</el-radio>
      <el-radio v-model="form.state" label="2">下架</el-radio>
    </el-form-item>
    <el-form-item label="课程内容：" prop="content" style="width: 1000px;">
      <label v-if="form.catType==1" for="inputId" icon="el-icon-plus">
        <video v-if="form.content" :src="form.content" pxcontrols></video>
        <div style="color: #fff;
        padding:0 5px;background-color: #1296db;width: 60px;border-radius: 5px;">上传视频</div>
        <input style="display: none" id="inputId" ref="input" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
      </label>
      <editor-bar v-if="form.catType==2" :value="form.content" v-model="form.content"></editor-bar>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveEdit">确 定</el-button>
      <el-button @click="goback">返 回</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      dictionarysList: {
        type: Array,
        default() {
          return []
        },
      }
    },

    data() {
      return {
        rules: {
          catType: [{ required: true, message: "请选择课程类型", trigger: "blur" }],
          catName: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
          content: [{ required: true, message: "请输入课程介绍", trigger: "blur" }],
          state: [{ required: true, message: "请输入选择状态", trigger: "blur" }],
        },
      }
    },
    methods: {
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("myfile", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.content = res.data;
          }
        });
      },
      saveEdit() {
        this.form.couId = this.$route.query.couId;
        this.$emit("saveEdit", this.form)
      },
      goback() {
        this.$router.go(-1)
      }
    }
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

  /* 
  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
  } */
</style>