<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="类别：" prop="category">
      <el-input v-model="form.category" class="handle-input"></el-input>
    
    </el-form-item>
    <el-form-item label="名称：" prop="collName">
      <el-input v-model="form.collName" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="区域：" prop="region">
      <el-input v-model="form.region" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="尺寸：" prop="size">
      <el-input v-model="form.size" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="年份：" prop="years">
      <el-input v-model="form.years" class="handle-input"></el-input>
    </el-form-item>
  
    <el-form-item label="点赞数：" prop="clickNumber">
      <el-input v-model="form.clickNumber" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="评论数：" prop="commentNumber">
      <el-input v-model="form.commentNumber" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="发布时间：" prop="collTime">
      <el-input v-model="form.collTime" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="状态：" prop="state">
      <div v-if="form.state">上架</div>
      <div v-else>下架</div>
    </el-form-item>
    <el-form-item label="证书：" prop="certificate">
      <img :src="form.certificate" alt="">
    </el-form-item>
    <el-form-item label="图片：" prop="picture">
   <img v-for="(item,index) in form.picture" :src="item" alt="">
    </el-form-item>
    <el-form-item label="介绍：" prop="intro">
    <div v-html="form.intro"></div>
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
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit("saveEdit", this.form)
          }
        })
      },
      goback() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .handle-select {
    width: 300px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  img {
    width: 100px;
    height: 100px;
   margin-right: 5px;
  }
</style>