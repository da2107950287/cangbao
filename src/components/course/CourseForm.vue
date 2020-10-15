<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="课程类型：" prop="couType">
      <el-select v-model="form.couType" placeholder="请选择类型" class="handle-select mr10">
        <el-option v-for="(item,index) in dictionarysList" :key="index" :label="item.dicName" :value="item.dicId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="课程名称：" prop="couName">
      <el-input v-model="form.couName" placeholder="请输入课程名称" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="课程作者：" prop="author">
      <el-input v-model="form.author" placeholder="请输入课程作者" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="课程状态：" prop="state">
      <el-radio v-model="form.state" label="1">上架</el-radio>
      <el-radio v-model="form.state" label="2">下架</el-radio>
    </el-form-item>
    <el-form-item label="课程封面：" prop="cover" class="personal-icon">
      <label for="inputId" icon="el-icon-plus">
        <img v-if="form.cover" :src="form.cover" />
        <img v-else src="~assets/img/headportrait.png" alt="">
        <input style="display: none" id="inputId" ref="input" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
      </label>
    </el-form-item>
    <el-form-item label="课程介绍：" prop="intro" style="width: 1000px;">
      <editor-bar :value="form.intro" v-model="form.intro"></editor-bar>
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
          couType: [{ required: true, message: "请选择课程类型", trigger: "blur" }],
          couName: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
          author: [{ required: true, message: "请输入课程作者", trigger: "blur" }],
          cover: [{ required: true, message: "请选择上传封面", trigger: "blur" }],
          intro: [{ required: true, message: "请输入课程介绍", trigger: "blur" }],
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
            this.form.cover = res.data;
          }
        });
      },
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit("saveEdit", this.form)
          }
        })
      },
      goback(){
        this.$router.go(-1);
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

  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
  }
</style>